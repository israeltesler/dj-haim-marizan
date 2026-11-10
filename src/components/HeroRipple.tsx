import { useEffect, useRef } from 'react'
import styles from './HeroRipple.module.css'

const TRAIL_POINTS = 9
const VERTEX = `attribute vec2 position; varying vec2 vUv; void main(){vUv=position*.5+.5;gl_Position=vec4(position,0.,1.);}`
const FRAGMENT = `
precision highp float;
varying vec2 vUv; uniform sampler2D image; uniform vec2 resolution,imageSize,mouse; uniform vec2 trail[9];
uniform float strength,time,positionY;
vec2 coverUv(vec2 uv){float rs=resolution.x/resolution.y,is=imageSize.x/imageSize.y;vec2 scale=rs<is?vec2(rs/is,1.):vec2(1.,is/rs);return uv*scale+vec2((1.-scale.x)*.5,(1.-scale.y)*(1.-positionY));}
void main(){vec2 uv=vUv;vec2 aspect=vec2(resolution.x/resolution.y,1.);vec2 delta=(uv-mouse)*aspect;float dist=length(delta);
float falloff=smoothstep(.47,0.,dist)*strength;vec2 dir=delta/(dist+.0001);vec2 tangent=vec2(-dir.y,dir.x);
float wave=sin(dist*38.-time*2.15)*falloff;float secondary=sin(dist*19.+time*.7)*falloff;
vec2 displacement=dir*(wave*.00525+falloff*.004)+tangent*secondary*.001875;vec2 sampleUv=coverUv(uv+displacement);
vec2 rgbShift=dir*(falloff*.0016+abs(wave)*.0012);vec3 color=vec3(texture2D(image,sampleUv+rgbShift).r,texture2D(image,sampleUv).g,texture2D(image,sampleUv-rgbShift).b);
float glow=falloff*(.10+.08*(sin(dist*28.-time*1.5)*.5+.5));float trailGlow=0.;
for(int i=0;i<9;i++){float d=length((uv-trail[i])*aspect);float age=1.-float(i)/9.;float shimmer=.82+.18*sin(time*2.-float(i)*.72);trailGlow+=(exp(-d*d*145.)*.48+exp(-d*d*420.)*.28)*age*age*shimmer;}
trailGlow=min(trailGlow,1.35)*strength*smoothstep(.035,.105,dist);color+=vec3(1.,.22,.025)*glow;color+=vec3(1.,.31,.045)*trailGlow*.46;color+=vec3(1.,.58,.20)*pow(trailGlow,1.65)*.11;gl_FragColor=vec4(color,1.);}`

type Props = { image: HTMLImageElement | null; onFallback: () => void }

export function HeroRipple({ image, onFallback }: Props) {
  const hostRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const host = hostRef.current
    if (!host || !image) return
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const canvas = document.createElement('canvas')
    host.append(canvas)
    const gl = canvas.getContext('webgl', { alpha: false, antialias: false })
    if (!gl) { onFallback(); canvas.remove(); return }
    const shader = (type: number, source: string) => {
      const value = gl.createShader(type)
      if (!value) throw new Error('shader')
      gl.shaderSource(value, source); gl.compileShader(value)
      if (!gl.getShaderParameter(value, gl.COMPILE_STATUS)) throw new Error('compile')
      return value
    }
    let program: WebGLProgram | null = null
    let buffer: WebGLBuffer | null = null
    let texture: WebGLTexture | null = null
    try {
      program = gl.createProgram()
      if (!program) throw new Error('program')
      gl.attachShader(program, shader(gl.VERTEX_SHADER, VERTEX))
      gl.attachShader(program, shader(gl.FRAGMENT_SHADER, FRAGMENT))
      gl.linkProgram(program)
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error('link')
      gl.useProgram(program)
      buffer = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW)
      const position = gl.getAttribLocation(program, 'position')
      gl.enableVertexAttribArray(position); gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)
      texture = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, texture)
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
    } catch {
      onFallback(); gl.getExtension('WEBGL_lose_context')?.loseContext(); canvas.remove(); return
    }
    const uniform = (name: string) => gl.getUniformLocation(program, name)
    const resolution = uniform('resolution'), imageSize = uniform('imageSize'), mouseU = uniform('mouse')
    const trailU = uniform('trail[0]'), strengthU = uniform('strength'), timeU = uniform('time')
    gl.uniform1f(uniform('positionY'), .35)
    gl.uniform2f(imageSize, image.naturalWidth, image.naturalHeight)
    let center = [.5, .5], target = [.5, .5], strength = 0, targetStrength = 0, frame = 0, last = performance.now(), first = true, visible = true
    const trail = Array.from({ length: TRAIL_POINTS }, () => [.5, .5])
    const resize = () => {
      const rect = host.getBoundingClientRect()
      const dpr = Math.min(devicePixelRatio, matchMedia('(max-width: 1023px)').matches ? 1.5 : 2.25)
      canvas.width = Math.max(1, Math.round(rect.width * dpr)); canvas.height = Math.max(1, Math.round(rect.height * dpr))
      gl.viewport(0, 0, canvas.width, canvas.height)
    }
    const ease = (amount: number, dt: number) => 1 - Math.pow(1 - amount, dt / 16.667)
    const draw = (now: number) => {
      const dt = Math.min(64, now - last); last = now
      center = center.map((v, i) => v + (target[i]! - v) * ease(.075, dt))
      strength += (targetStrength - strength) * ease(targetStrength ? .07 : .028, dt)
      trail.forEach((point, i) => {
        const goal = i ? trail[i - 1]! : center
        point[0] += (goal[0] - point[0]) * ease(.19 - i * .009, dt)
        point[1] += (goal[1] - point[1]) * ease(.19 - i * .009, dt)
      })
      gl.uniform2f(resolution, canvas.width, canvas.height); gl.uniform2f(mouseU, center[0]!, center[1]!)
      gl.uniform2fv(trailU, new Float32Array(trail.flat())); gl.uniform1f(strengthU, strength); gl.uniform1f(timeU, now / 1000)
      gl.drawArrays(gl.TRIANGLES, 0, 6)
      if (first) { first = false; canvas.style.opacity = '1' }
      frame = targetStrength || strength > .001 ? requestAnimationFrame(draw) : 0
    }
    const start = () => { if (!frame && visible) { last = performance.now(); frame = requestAnimationFrame(draw) } }
    const move = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      target = [(event.clientX - rect.left) / rect.width, 1 - (event.clientY - rect.top) / rect.height]
      targetStrength = 1
      start()
    }
    const end = () => { targetStrength = 0; start() }
    const resizeObserver = new ResizeObserver(() => { resize(); start() })
    const intersection = new IntersectionObserver(([entry]) => {
      visible = Boolean(entry?.isIntersecting)
      if (!visible) { cancelAnimationFrame(frame); frame = 0 } else start()
    })
    resize(); resizeObserver.observe(host); intersection.observe(host)
    const surface = host.parentElement?.parentElement
    surface?.addEventListener('pointermove', move, { passive: true })
    surface?.addEventListener('pointerdown', move, { passive: true })
    surface?.addEventListener('pointerup', end, { passive: true })
    surface?.addEventListener('pointercancel', end, { passive: true })
    surface?.addEventListener('pointerleave', end, { passive: true })
    start()
    return () => {
      cancelAnimationFrame(frame); resizeObserver.disconnect(); intersection.disconnect()
      surface?.removeEventListener('pointermove', move)
      surface?.removeEventListener('pointerdown', move)
      surface?.removeEventListener('pointerup', end)
      surface?.removeEventListener('pointercancel', end)
      surface?.removeEventListener('pointerleave', end)
      if (program) gl.deleteProgram(program); if (texture) gl.deleteTexture(texture); if (buffer) gl.deleteBuffer(buffer)
      gl.getExtension('WEBGL_lose_context')?.loseContext(); canvas.remove()
    }
  }, [image, onFallback])
  return <div ref={hostRef} className={styles.host} />
}
