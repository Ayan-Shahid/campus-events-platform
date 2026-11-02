// Page background. Composed as: header ("#version 300 es" + precision) + chunks/noise.glsl + this file.
// Needs hash21() and fbm() from the noise chunk, so it will not compile on its own.

uniform vec2 u_resolution; // canvas size in pixels
uniform float u_time;      // seconds; slowed down below
uniform float u_seed;      // per-instance offset, in noise cells (use something like 0..100)
uniform vec3 u_palette[4]; // 0 base, 1 mid, 2 vein highlight, 3 shadow (vignette target)
uniform vec3 u_accent;     // contour line colour
uniform float u_grain;     // film-grain strength

in vec2 v_uv;
out vec4 outColor;

const float SCALE = 2.2;        // noise cells across the short side
const float FLOW_SPEED = 0.035; // how fast the liquid drifts
const float LINE_COUNT = 9.0;   // contour lines across the 0..1 range of f
const float LINE_SPEED = 0.02;  // how fast the contours crawl

void main() {
    float t = u_time * FLOW_SPEED;

    // Aspect-correct coordinates, centred, offset by the per-instance seed.
    float aspect = u_resolution.x / u_resolution.y;
    vec2 p = (v_uv - 0.5) * vec2(aspect, 1.0) * SCALE + u_seed * vec2(1.0, 0.7);

    // Domain warping: noise bends the lookup of noise, which gives the slow liquid flow.
    vec2 q = vec2(
    fbm(p + vec2(0.0, t)),
    fbm(p + vec2(5.2, 1.3) - vec2(t, 0.0))
    );
    vec2 w = vec2(
    fbm(p + 4.0 * q + vec2(1.7, 9.2) + t),
    fbm(p + 4.0 * q + vec2(8.3, 2.8) - t)
    );
    float f = fbm(p + 4.0 * w);

    // Base colour: palette 0 -> 1 by f, then palette 2 where w.x is high (the teal veins).
    vec3 col = mix(u_palette[0], u_palette[1], smoothstep(0.15, 0.85, f));
    col = mix(col, u_palette[2], smoothstep(0.55, 0.85, w.x) * 0.65);

    // Contour lines: thin lines where fract() is near 0 or 1, only in patches where w.y is high.
    // fwidth() keeps the line about one pixel wide at any resolution.
    float x = f * LINE_COUNT + u_time * LINE_SPEED;
    float dist = min(fract(x), 1.0 - fract(x));
    float px = fwidth(x);
    float line = 1.0 - smoothstep(px * 0.5, px * 1.5, dist);
    float patches = smoothstep(0.5, 0.75, w.y);
    col = mix(col, u_accent, line * patches * 0.7);

    // Soft vignette: edges fall toward the shadow colour so centred text keeps its contrast.
    float vignette = smoothstep(0.35, 1.0, length((v_uv - 0.5) * vec2(aspect, 1.0)) / (0.5 * max(aspect, 1.0)));
    col = mix(col, u_palette[3], vignette * 0.8);

    // Grain: per-pixel hash, re-seeded 24 times a second like film. Frozen when u_time is frozen.
    vec2 frame = floor(u_time * 24.0) * vec2(37.0, 17.0);
    col += (hash21(gl_FragCoord.xy + frame) - 0.5) * u_grain;

    outColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
