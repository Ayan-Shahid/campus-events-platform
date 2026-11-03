import { describe, expect, it } from 'vitest';
import { createFakeGl } from '@tests/utils/fake-gl';
import { createProgram, ShaderCompileError } from './gl-program';

const VERTEX = '#version 300 es\nvoid main() {}';
const FRAGMENT =
  '#version 300 es\nprecision highp float;\nout vec4 c;\nvoid main() { c = vec4(oops); }';

describe('createProgram', () => {
  it('compiles, links, and frees the shader objects', () => {
    const { gl, spies } = createFakeGl();

    const program = createProgram(gl, 'background', VERTEX, FRAGMENT);

    expect(program.name).toBe('background');
    expect(spies.linkProgram).toHaveBeenCalledTimes(1);
    expect(spies.deleteShader).toHaveBeenCalledTimes(2);
    expect(spies.detachShader).toHaveBeenCalledTimes(2);
  });

  it('caches uniform locations, including ones the driver optimised away', () => {
    const { gl, spies } = createFakeGl();
    spies.getUniformLocation.mockImplementation(((_program: unknown, name: string) =>
      name === 'u_gone' ? null : { uniform: name }) as never);
    const program = createProgram(gl, 'surface', VERTEX, FRAGMENT);

    expect(program.uniform('u_time')).toBe(program.uniform('u_time'));
    expect(program.uniform('u_gone')).toBeNull();
    expect(program.uniform('u_gone')).toBeNull();
    expect(spies.getUniformLocation).toHaveBeenCalledTimes(2);
  });

  it('dispose deletes the program', () => {
    const { gl, spies } = createFakeGl();
    createProgram(gl, 'surface', VERTEX, FRAGMENT).dispose();
    expect(spies.deleteProgram).toHaveBeenCalledTimes(1);
  });

  describe('failures', () => {
    it('names the shader, the stage, the driver log and the offending line', () => {
      const { gl, spies } = createFakeGl({
        compileError: (stage) =>
          stage === 'fragment' ? "ERROR: 0:4: 'oops' : undeclared identifier\n\0" : null,
      });

      let caught: unknown;
      try {
        createProgram(gl, 'card-surface', VERTEX, FRAGMENT);
      } catch (error) {
        caught = error;
      }

      expect(caught).toBeInstanceOf(ShaderCompileError);
      const error = caught as ShaderCompileError;
      expect(error.name).toBe('ShaderCompileError');
      expect(error.shaderName).toBe('card-surface');
      expect(error.stage).toBe('fragment');
      expect(error.infoLog).toBe("ERROR: 0:4: 'oops' : undeclared identifier");
      expect(error.message).toContain('Shader "card-surface" failed to compile (fragment shader)');
      expect(error.message).toContain("'oops' : undeclared identifier");
      expect(error.message).toContain('   4 | void main() { c = vec4(oops); }');
      // Nothing leaks: both shader objects are deleted and no program was linked.
      expect(spies.deleteShader).toHaveBeenCalledTimes(2);
      expect(spies.linkProgram).not.toHaveBeenCalled();
    });

    it('reports a vertex failure as such and stops before the fragment stage', () => {
      const { gl, spies } = createFakeGl({ compileError: () => 'ERROR: 0:1: bad' });

      expect(() => createProgram(gl, 'background', VERTEX, FRAGMENT)).toThrowError(
        /Shader "background" failed to compile \(vertex shader\)/,
      );
      expect(spies.createShader).toHaveBeenCalledTimes(1);
    });

    it('reports link failures and deletes the program', () => {
      const { gl, spies } = createFakeGl({ linkError: () => 'varying v_uv not written' });

      expect(() => createProgram(gl, 'background', VERTEX, FRAGMENT)).toThrowError(
        /Shader "background" failed to link:\nvarying v_uv not written/,
      );
      expect(spies.deleteProgram).toHaveBeenCalledTimes(1);
    });

    it('still explains an empty driver log', () => {
      const { gl } = createFakeGl({ compileError: () => ' ' });
      expect(() => createProgram(gl, 'x', VERTEX, FRAGMENT)).toThrowError(/gave no details/);
    });

    it('explains a null shader (lost context)', () => {
      const { gl, spies } = createFakeGl();
      spies.createShader.mockReturnValue(null as never);
      expect(() => createProgram(gl, 'x', VERTEX, FRAGMENT)).toThrowError(/is the context lost/);
    });
  });
});
