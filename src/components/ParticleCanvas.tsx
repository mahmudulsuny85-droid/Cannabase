import { useEffect, useRef } from "react";

export default function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(canvas);

    interface DustParticle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      pulseSpeed: number;
      pulseAngle: number;
      baseSpeedY: number;
    }

    const mouse = { x: -1000, y: -1000 };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove);

    const particleCount = 65;
    const list: DustParticle[] = [];
    for (let i = 0; i < particleCount; i++) {
      const bSpeed = -(Math.random() * 0.2 + 0.1);
      list.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: Math.random() * 0.2 - 0.1,
        vy: bSpeed,
        baseSpeedY: bSpeed,
        size: Math.random() * 2 + 0.8,
        opacity: Math.random() * 0.4 + 0.15,
        pulseSpeed: Math.random() * 0.03 + 0.015,
        pulseAngle: Math.random() * Math.PI,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      const isLight =
        document.documentElement.getAttribute("data-mode") === "light";

      list.forEach((p) => {
        // Compute distance to mouse
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const distSq = dx * dx + dy * dy;
        const dist = Math.sqrt(distSq);
        const radius = 250;

        if (dist < radius) {
          const force = (radius - dist) / radius;
          // Pulling force
          p.vx += dx * force * 0.015;
          p.vy += dy * force * 0.015;

          // Swirl effect (orbital)
          p.vx += dy * force * 0.045;
          p.vy -= dx * force * 0.045;
        }

        // Apply velocities
        p.x += p.vx;
        p.y += p.vy;

        // Damping: gradually return to base drift
        p.vx *= 0.95;
        p.vy = p.vy * 0.95 + p.baseSpeedY * 0.05;

        p.pulseAngle += p.pulseSpeed;

        // Wrap around boundaries
        if (p.y < -30) {
          p.y = height + 30;
          p.x = Math.random() * width;
        } else if (p.y > height + 30) {
          p.y = -30;
        }

        if (p.x < -30) {
          p.x = width + 30;
        } else if (p.x > width + 30) {
          p.x = -30;
        }

        const alpha = p.opacity * (0.65 + 0.35 * Math.sin(p.pulseAngle));
        ctx.beginPath();

        const gradient = ctx.createRadialGradient(
          p.x,
          p.y,
          0,
          p.x,
          p.y,
          p.size * 3.5,
        );

        if (isLight) {
          gradient.addColorStop(0, `rgba(184, 115, 51, ${alpha * 1.5})`);
          gradient.addColorStop(0.3, `rgba(5, 150, 105, ${alpha * 0.8})`);
        } else {
          gradient.addColorStop(0, `rgba(209, 168, 117, ${alpha})`);
          gradient.addColorStop(0.3, `rgba(16, 185, 129, ${alpha * 0.45})`);
        }
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

        ctx.fillStyle = gradient;
        ctx.arc(p.x, p.y, p.size * 3.5, 0, Math.PI * 2);
        ctx.fill();
      });
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="ambient-dust-canvas"
      className="absolute inset-0 w-full h-full pointer-events-none z-10 opacity-75"
    />
  );
}
