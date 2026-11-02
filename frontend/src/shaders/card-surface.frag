// Card surface. Composed as: header ("#version 300 es" + precision) + chunks/noise.glsl + this file.
// Needs hash21() and fbm() from the noise chunk, so it will not compile on its own.
//
// This sits under text, so everything is subtle and capped. The total brightness added on top
// of palette 0/1 is at most NOISE_MIX + SWEEP + WARM + COOL (+ grain). If a contrast check
// fails, lower SWEEP first; do not change the text colour.

uniform vec2 u_resolution; // canvas size in pixels
uniform float u_time;      // seconds; slowed down below
uniform float u_seed;      // per-instance offset, in noise cells (use something like 0..100)
uniform vec3 u_palette[4]; // only 0 (base) and 1 (mid) are used here
uniform vec3 u_accent;     // light sweep colour
uniform float u_grain;     // film-grain strength (halved here)

in vec2 v_uv;
out vec4 outColor;

const float NOISE_MIX = 0.35;  // how far fbm may pull palette 0 toward palette 1
const float SWEEP = 0.04;      // light sweep strength  <- first thing to reduce on a contrast fail
const float WARM = 0.05;       // glow near the bottom edge
const float COOL = 0.04;       // glow in the top-left corner
const vec3 WARM_COLOR = vec3(1.0, 0.62, 0.35);
const vec3 COOL_COLOR = vec3(0.35, 0.70, 1.0);

void main() {
    float aspect = u_resolution.x / u_resolution.y;
    float t = u_time * 0.02;

    // Low-contrast fbm between palette 0 and 1.
    vec2 p = v_uv * vec2(aspect, 1.0) * 2.0 + u_seed * vec2(1.0, 0.7);
    float f = fbm(p + vec2(t, -t));
    vec3 col = mix(u_palette[0], u_palette[1], f * NOISE_MIX);

    // Slow diagonal light sweep; the seed shifts its phase so cards are not in lockstep.
    float phase = fract(t * 0.5 + hash21(vec2(u_seed, 1.0)));
    float along = (v_uv.x + v_uv.y) * 0.5;
    float band = exp(-pow((along - (phase * 1.6 - 0.3)) / 0.16, 2.0));
    col += u_accent * band * SWEEP;

    // v_uv.y is 0 at the bottom edge and 1 at the top. Warm glow below, cool glow top-left.
    col += WARM_COLOR * smoothstep(0.35, 0.0, v_uv.y) * WARM;
    float corner = length((v_uv - vec2(0.0, 1.0)) * vec2(aspect, 1.0));
    col += COOL_COLOR * smoothstep(0.9, 0.0, corner) * COOL;

    // Grain, weaker than the background's.
    vec2 frame = floor(u_time * 24.0) * vec2(37.0, 17.0);
    col += (hash21(gl_FragCoord.xy + frame) - 0.5) * u_grain * 0.5;

    outColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
