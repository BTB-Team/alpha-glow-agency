import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import gsap from 'gsap';
import db from '../../../db.json';
import fa from '../../locales/fa.json';
import en from '../../locales/en.json';

// ۱. رسم تکسچر آیکون‌ها با رنگ‌های اصلی برند و وکتور دقیق
function createRealBrandTexture(type) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (type === 'instagram') {
    const igGrad = ctx.createRadialGradient(140, 480, 20, 280, 220, 480);
    igGrad.addColorStop(0, '#ffd600');
    igGrad.addColorStop(0.25, '#ff7a00');
    igGrad.addColorStop(0.5, '#ff0069');
    igGrad.addColorStop(0.75, '#d300c5');
    igGrad.addColorStop(1, '#7638fa');
    ctx.fillStyle = igGrad;
    ctx.fillRect(0, 0, 512, 512);
  } else if (type === 'facebook') {
    const fbGrad = ctx.createLinearGradient(0, 0, 0, 512);
    fbGrad.addColorStop(0, '#18ACFE');
    fbGrad.addColorStop(1, '#0163E0');
    ctx.fillStyle = fbGrad;
    ctx.fillRect(0, 0, 512, 512);
  } else if (type === 'linkedin') {
    const liGrad = ctx.createLinearGradient(0, 0, 512, 512);
    liGrad.addColorStop(0, '#0A66C2');
    liGrad.addColorStop(1, '#004182');
    ctx.fillStyle = liGrad;
    ctx.fillRect(0, 0, 512, 512);
  } else if (type === 'telegram') {
    const tgGrad = ctx.createLinearGradient(0, 0, 0, 512);
    tgGrad.addColorStop(0, '#37BBFE');
    tgGrad.addColorStop(1, '#007DBB');
    ctx.fillStyle = tgGrad;
    ctx.fillRect(0, 0, 512, 512);
  } else if (type === 'whatsapp') {
    const waGrad = ctx.createLinearGradient(0, 0, 0, 512);
    waGrad.addColorStop(0, '#5FFC7B');
    waGrad.addColorStop(1, '#20B038');
    ctx.fillStyle = waGrad;
    ctx.fillRect(0, 0, 512, 512);
  }

  // قاب شیشه‌ای دور کاشی
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.38)';
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.roundRect(22, 22, 468, 468, 96);
  ctx.stroke();
  ctx.restore();

  // رسم وکتور سفید لوگوها
  ctx.save();
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#ffffff';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.22)';
  ctx.shadowBlur = 16;
  ctx.shadowOffsetY = 6;

  if (type === 'instagram') {
    ctx.lineWidth = 26;
    ctx.beginPath();
    ctx.roundRect(136, 136, 240, 240, 68);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(256, 256, 58, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(322, 190, 16, 0, Math.PI * 2);
    ctx.fill();
  } else if (type === 'facebook') {
    ctx.font = '900 330px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('f', 275, 295);
  } else if (type === 'linkedin') {
    ctx.font = '900 220px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('in', 256, 272);
  } else if (type === 'telegram') {
    ctx.translate(106, 106);
    ctx.scale(12.5, 12.5);
    const tgPath = new Path2D(
      'M20.665 3.717l-17.73 6.837c-1.21.486-1.203 1.161-.222 1.462l4.552 1.42 10.532-6.645c.498-.303.953-.14.579.192l-8.533 7.701h-.002l.002.001-.314 4.692c.46 0 .663-.211.921-.46l2.211-2.15 4.599 3.397c.848.467 1.457.227 1.668-.785l3.019-14.228c.309-1.239-.473-1.8-1.282-1.434z'
    );
    ctx.fill(tgPath);
  } else if (type === 'whatsapp') {
    ctx.translate(108, 108);
    ctx.scale(12.3, 12.3);
    const waPath = new Path2D(
      'M12.031 2c-5.516 0-9.969 4.453-9.969 9.969 0 1.766.469 3.484 1.344 5l-1.406 5.156 5.281-1.375c1.469.797 3.094 1.219 4.75 1.219 5.516 0 9.969-4.453 9.969-9.969s-4.453-10-9.969-10zm0 18.156c-1.5 0-2.969-.406-4.25-1.172l-.313-.188-3.125.813.844-3.031-.203-.313c-.828-1.313-1.266-2.828-1.266-4.391 0-4.547 3.703-8.25 8.25-8.25 4.563 0 8.25 3.703 8.25 8.25s-3.625 8.281-8.188 8.281zm4.531-6.188c-.25-.125-1.469-.719-1.703-.813-.219-.078-.391-.125-.547.125-.172.25-.641.813-.797.969-.141.172-.297.188-.547.063-.25-.125-1.047-.391-2-1.234-.734-.656-1.234-1.469-1.375-1.719-.141-.25-.016-.375.109-.5.109-.109.25-.297.375-.438.125-.141.172-.25.25-.422.078-.172.047-.313-.016-.438-.063-.125-.547-1.328-.75-1.813-.203-.484-.406-.406-.547-.422-.141-.016-.313-.016-.469-.016s-.438.063-.672.313c-.219.25-.859.844-.859 2.063s.891 2.391 1.016 2.563c.125.172 1.75 2.672 4.234 3.75.594.25 1.047.406 1.406.516.594.188 1.141.156 1.563.094.484-.078 1.469-.594 1.672-1.172.203-.578.203-1.078.141-1.172-.063-.109-.219-.172-.469-.297z'
    );
    ctx.fill(waPath);
  }

  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 8;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// ۲. ساخت مدل سه‌بعدی لوگوی Alpha Glow (AG) بر اساس مختصات دقیق هندسی لوگو
function buildAlphaGlow3DLogo() {
  const logoGroup = new THREE.Group();
  const disposables = [];

  // مختصات وکتور دقیق لوگوی AG
  const rawPoints = [
    [500, 174], // قله بالایی مثلث
    [153, 773], // گوشه بیرونی پایین-چپ پایه A
    [248, 773], // گوشه داخلی پایین-چپ پایه A
    [338, 616], // اتصال پایین خط افقی A
    [411, 616], // نوک پایین-راست خط افقی A
    [458, 535], // نوک بالا-راست خط افقی A
    [385, 535], // اتصال بالای خط افقی A
    [500, 336], // قله داخلی بالای A
    [550, 422], // چرخش داخلی بالای بازوی میانی
    [347, 773], // راس پایین-چپ بخش G
    [847, 773], // گوشه بیرونی پایین-راست G
    [710, 535], // لبه بیرونی راست-بالای G
    [592, 535], // لبه بالا-چپ زبانه افقی G
    [546, 616], // لبه پایین-چپ زبانه افقی G
    [663, 616], // گوشه داخلی بالا-راست حفره G
    [708, 692], // گوشه داخلی پایین-راست حفره G
    [487, 692], // گوشه داخلی پایین-چپ حفره G
    [643, 422], // لبه بیرونی راست قبل از قله
  ];

  const scale = 0.0044;
  const shape = new THREE.Shape();

  rawPoints.forEach(([px, py], index) => {
    const x = (px - 500) * scale;
    const y = (485 - py) * scale;
    if (index === 0) {
      shape.moveTo(x, y);
    } else {
      shape.lineTo(x, y);
    }
  });
  shape.closePath();

  // تنظیمات حجم‌دهی سه‌بعدی (Extrude) با لبه‌های پخ‌خورده صیقلی
  const extrudeSettings = {
    depth: 0.42,
    bevelEnabled: true,
    bevelSegments: 8,
    steps: 1,
    bevelSize: 0.045,
    bevelThickness: 0.055,
  };

  const logoGeo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  logoGeo.center(); // قرار دادن مرکز ثقل دقیق لوگو در نقطه (0,0,0)

  // متریال وجه رویی و پشتی (سفید صدفی درخشان)
  const frontMaterial = new THREE.MeshPhysicalMaterial({
    color: '#ffffff',
    emissive: '#bae6fd',
    emissiveIntensity: 0.18,
    metalness: 0.15,
    roughness: 0.12,
    clearcoat: 1.0,
    clearcoatRoughness: 0.06,
  });

  // متریال دیواره سه‌بعدی و پخ‌های کناری (آبی/سورمه‌ای متالیک برند آلفا گلو)
  const sideMaterial = new THREE.MeshPhysicalMaterial({
    color: '#1e3a8a',
    emissive: '#0284c7',
    emissiveIntensity: 0.32,
    metalness: 0.75,
    roughness: 0.18,
    clearcoat: 1.0,
    clearcoatRoughness: 0.08,
  });

  const logoMesh = new THREE.Mesh(logoGeo, [frontMaterial, sideMaterial]);
  logoGroup.add(logoMesh);
  disposables.push(logoGeo, frontMaterial, sideMaterial);

  // حلقه نوری ظریف دور مدار لوگو برای جلوه فضایی‌تر
  const haloGeo = new THREE.TorusGeometry(1.95, 0.016, 20, 100);
  const haloMat = new THREE.MeshBasicMaterial({
    color: '#38bdf8',
    transparent: true,
    opacity: 0.35,
  });
  const haloMesh = new THREE.Mesh(haloGeo, haloMat);
  haloMesh.rotation.set(Math.PI / 2.3, 0.25, 0);
  logoGroup.add(haloMesh);
  disposables.push(haloGeo, haloMat);

  // انیمیشن حرکت شناور و چرخش نرم لوگوی سه‌بعدی با GSAP
  const tweens = [
    gsap.to(logoMesh.rotation, {
      y: 0.38,
      duration: 3.4,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    }),
    gsap.fromTo(
      logoMesh.rotation,
      { y: -0.38, x: -0.06 },
      {
        y: 0.38,
        x: 0.06,
        duration: 3.6,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      }
    ),
    gsap.to(haloMesh.rotation, {
      z: Math.PI * 2,
      duration: 20,
      repeat: -1,
      ease: 'none',
    }),
    gsap.to(logoGroup.position, {
      y: 0.14,
      duration: 2.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    }),
  ];

  return { logoGroup, disposables, tweens };
}

export default function ContactSocial3D() {
  const { lang } = useParams();
  const currentLang = lang === 'fa' ? 'fa' : 'en';
  const t = currentLang === 'en' ? en : fa;
  const copy = t.contactHero3D;

  const mountRef = useRef(null);
  const [hoveredSocial, setHoveredSocial] = useState(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // ۱. صحنه، دوربین و رندرر
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      38,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // ۲. نورپردازی استودیویی برای درخشش لوگوی AG و آیکون‌ها
    const ambientLight = new THREE.AmbientLight('#ffffff', 1.55);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight('#ffffff', 2.8);
    keyLight.position.set(5, 7, 8);
    scene.add(keyLight);

    const blueRimLight = new THREE.PointLight('#38bdf8', 4.2, 18);
    blueRimLight.position.set(-4, 2, 4);
    scene.add(blueRimLight);

    const backRimLight = new THREE.PointLight('#2563eb', 3.5, 18);
    backRimLight.position.set(4, -3, -4);
    scene.add(backRimLight);

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // ۳. افزودن مدل سه‌بعدی لوگوی Alpha Glow به مرکز صحنه
    const {
      logoGroup,
      disposables: logoDisposables,
      tweens: logoTweens,
    } = buildAlphaGlow3DLogo();
    rootGroup.add(logoGroup);

    // ۴. ساخت ۵ آیکون سه‌بعدی با رنگ واقعی برندها
    const socialItems = [
      {
        id: 'instagram',
        label: 'Instagram',
        sideColor: '#c13584',
        url: db?.contactSocials?.instagram || 'https://instagram.com',
      },
      {
        id: 'facebook',
        label: 'Facebook',
        sideColor: '#0163E0',
        url: db?.contactSocials?.facebook || 'https://facebook.com',
      },
      {
        id: 'linkedin',
        label: 'LinkedIn',
        sideColor: '#0A66C2',
        url: db?.contactSocials?.linkedin || 'https://linkedin.com',
      },
      {
        id: 'telegram',
        label: 'Telegram',
        sideColor: '#0088cc',
        url: db?.contactSocials?.telegram || 'https://t.me',
      },
      {
        id: 'whatsapp',
        label: 'WhatsApp',
        sideColor: '#20B038',
        url: db?.contactSocials?.whatsapp || 'https://wa.me',
      },
    ];

    const tileGeometry = new RoundedBoxGeometry(1.12, 1.12, 0.3, 8, 0.24);
    const meshes = [];
    const disposableMaterials = [];

    socialItems.forEach((item, index) => {
      const faceTexture = createRealBrandTexture(item.id);
      const faceMat = new THREE.MeshPhysicalMaterial({
        map: faceTexture,
        roughness: 0.16,
        metalness: 0.12,
        clearcoat: 1.0,
        clearcoatRoughness: 0.08,
      });

      const sideMat = new THREE.MeshPhysicalMaterial({
        color: item.sideColor,
        roughness: 0.22,
        metalness: 0.3,
        clearcoat: 0.9,
        clearcoatRoughness: 0.1,
      });

      disposableMaterials.push(faceMat, sideMat, faceTexture);

      const materials = [sideMat, sideMat, sideMat, sideMat, faceMat, faceMat];
      const mesh = new THREE.Mesh(tileGeometry, materials);

      mesh.userData = {
        id: item.id,
        label: item.label,
        url: item.url,
        orbitIndex: index,
      };

      rootGroup.add(mesh);
      meshes.push(mesh);
    });

    // ۵. تنظیمات مدار چرخش ریسپانسیو به دور لوگوی سه‌بعدی
    const orbitParams = {
      progress: 0,
      radiusX: 3.15,
      radiusZ: 2.35,
      tiltX: 0.3,
      tiltZ: 0.44,
    };

    const updateOrbitPositions = () => {
      const total = meshes.length;
      const tiltEuler = new THREE.Euler(
        orbitParams.tiltX,
        0.08,
        orbitParams.tiltZ
      );

      meshes.forEach((mesh, idx) => {
        const theta = orbitParams.progress + (idx * Math.PI * 2) / total;

        const pos = new THREE.Vector3(
          Math.cos(theta) * orbitParams.radiusX,
          Math.sin(theta * 2) * 0.16,
          Math.sin(theta) * orbitParams.radiusZ
        );
        pos.applyEuler(tiltEuler);

        mesh.position.copy(pos);

        // زاویه سه‌بعدی کاشی‌ها رو به بیننده
        mesh.rotation.set(
          -0.1 + Math.sin(theta) * 0.2,
          Math.cos(theta) * 0.35,
          -0.12 + Math.cos(theta) * 0.14
        );
      });
    };

    // انیمیشن چرخش پیوسته مدار با GSAP
    const orbitTween = gsap.to(orbitParams, {
      progress: Math.PI * 2,
      duration: 16,
      repeat: -1,
      ease: 'none',
      onUpdate: updateOrbitPositions,
    });

    // ۶. تابع ریسپانسیو هوشمند برای موبایل، تبلت و دسکتاپ
    const updateResponsiveLayout = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      if (width === 0 || height === 0) return;

      const aspect = width / height;
      camera.aspect = aspect;

      if (width < 480) {
        // موبایل کوچک (عمودی)
        camera.position.z = 11.8;
        rootGroup.scale.setScalar(Math.min(1, aspect * 1.32));
        orbitParams.radiusX = 2.45;
        orbitParams.radiusZ = 1.95;
        orbitParams.tiltZ = 0.52;
      } else if (width < 768) {
        // موبایل بزرگ و فبلت
        camera.position.z = 11.2;
        rootGroup.scale.setScalar(Math.min(1, aspect * 1.2));
        orbitParams.radiusX = 2.75;
        orbitParams.radiusZ = 2.15;
        orbitParams.tiltZ = 0.48;
      } else if (width < 1024) {
        // تبلت
        camera.position.z = 10.8;
        rootGroup.scale.setScalar(0.95);
        orbitParams.radiusX = 3.0;
        orbitParams.radiusZ = 2.3;
        orbitParams.tiltZ = 0.45;
      } else {
        // دسکتاپ
        camera.position.z = 10.4;
        rootGroup.scale.setScalar(1);
        orbitParams.radiusX = 3.2;
        orbitParams.radiusZ = 2.4;
        orbitParams.tiltZ = 0.42;
      }

      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      updateOrbitPositions();
    };

    updateResponsiveLayout();

    // مشاهده‌گر تغییر سایز کانتینر برای ریسپانسیو آنی
    const resizeObserver = new ResizeObserver(() => {
      updateResponsiveLayout();
    });
    resizeObserver.observe(container);
    window.addEventListener('resize', updateResponsiveLayout);

    // ۷. تعامل موس و لمس موبایل (Raycaster)
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let activeMesh = null;

    const getHitMesh = (clientX, clientY) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(meshes);
      return intersects.length > 0 ? intersects[0].object : null;
    };

    const handlePointerMove = (e) => {
      const hitMesh = getHitMesh(e.clientX, e.clientY);

      // پارالاکس نرم کل صحنه با حرکت موس
      gsap.to(rootGroup.rotation, {
        y: mouse.x * 0.24,
        x: -mouse.y * 0.14,
        duration: 0.8,
        ease: 'power2.out',
      });

      if (hitMesh) {
        if (activeMesh !== hitMesh) {
          if (activeMesh) {
            gsap.to(activeMesh.scale, { x: 1, y: 1, z: 1, duration: 0.3 });
          }
          activeMesh = hitMesh;
          setHoveredSocial(hitMesh.userData.label);
          renderer.domElement.style.cursor = 'pointer';

          gsap.to(orbitTween, { timeScale: 0.12, duration: 0.4 });
          gsap.to(hitMesh.scale, {
            x: 1.24,
            y: 1.24,
            z: 1.24,
            duration: 0.35,
            ease: 'back.out(2)',
          });
        }
      } else if (activeMesh) {
        gsap.to(activeMesh.scale, { x: 1, y: 1, z: 1, duration: 0.3 });
        gsap.to(orbitTween, { timeScale: 1, duration: 0.5 });
        activeMesh = null;
        setHoveredSocial(null);
        renderer.domElement.style.cursor = 'default';
      }
    };

    // پشتیبانی همزمان از کلیک دسکتاپ و لمس (Tap) در موبایل
    const handleClick = (e) => {
      const targetMesh = getHitMesh(e.clientX, e.clientY) || activeMesh;
      if (targetMesh && targetMesh.userData.url) {
        window.open(targetMesh.userData.url, '_blank', 'noopener,noreferrer');
      }
    };

    const domElem = renderer.domElement;
    domElem.addEventListener('pointermove', handlePointerMove);
    domElem.addEventListener('click', handleClick);

    let reqId;
    const animate = () => {
      reqId = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(reqId);
      resizeObserver.disconnect();
      orbitTween.kill();
      logoTweens.forEach((t) => t.kill());
      domElem.removeEventListener('pointermove', handlePointerMove);
      domElem.removeEventListener('click', handleClick);
      window.removeEventListener('resize', updateResponsiveLayout);
      tileGeometry.dispose();
      logoDisposables.forEach((d) => d.dispose && d.dispose());
      disposableMaterials.forEach((m) => m.dispose && m.dispose());
      renderer.dispose();
      if (container.contains(domElem)) {
        container.removeChild(domElem);
      }
    };
  }, []);

  return (
    <section className="relative w-full h-[460px] sm:h-[560px] md:h-[660px] flex flex-col justify-end items-center overflow-hidden bg-slate-50 dark:bg-[#030712] transition-colors duration-500 py-8 sm:py-12 select-none">
      {/* هاله نوری پس‌زمینه برای برجستگی لوگوی سه‌بعدی سفید و سورمه‌ای در هر دو تم */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[260px] sm:w-[440px] h-[260px] sm:h-[440px] bg-blue-600/20 dark:bg-sky-500/20 rounded-full blur-[95px] sm:blur-[120px] pointer-events-none" />

      {/* بوم سه‌بعدی Three.js */}
      <div
        ref={mountRef}
        className="absolute inset-0 w-full h-full z-10 touch-pan-y"
      />

      {/* کپسول شیشه‌ای پایین */}
      <div className="relative z-20 pointer-events-none mt-auto px-4">
        <div className="alpha-glass-bar px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold font-body text-blue-900 dark:text-sky-300 text-center">
          {hoveredSocial
            ? `↗ ${hoveredSocial}`
            : copy?.hint || 'Click on any 3D icon to connect'}
        </div>
      </div>
    </section>
  );
}