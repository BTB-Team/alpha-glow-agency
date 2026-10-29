import * as THREE from 'three';
import gsap from 'gsap';

/**
 * ۱. ایجاد بافت نوری نرم (Radial Glow Sprite) برای ذرات و سر دنباله شهاب‌سنگی
 */
function createGlowTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(0.25, 'rgba(147, 197, 253, 0.85)');
  gradient.addColorStop(0.6, 'rgba(59, 130, 246, 0.25)');
  gradient.addColorStop(1, 'rgba(33, 54, 104, 0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(canvas);
}

/**
 * ۲. ایجاد تکسچرهای سطح رویی، پخ لبه‌ها (Bevel) و بدنه اکسترود سه‌بعدی برای هر حرف/کلمه
 * این روش اتصال صحیح حروف فارسی (HarfBuzz مرورگر) و حجم واقعی سه‌بعدی را تضمین می‌کند
 */
function create3DGlyphTextures(text, fontFamily, isDark) {
  const measureCanvas = document.createElement('canvas');
  const mCtx = measureCanvas.getContext('2d');
  const fontSize = 110;
  const fontStr = `900 ${fontSize}px ${fontFamily}`;
  mCtx.font = fontStr;

  const metrics = mCtx.measureText(text);
  const textWidth = Math.ceil(metrics.width);
  const pad = 48;
  const canvasWidth = Math.max(128, textWidth + pad * 2);
  const canvasHeight = 200;

  // الف) تکسچر سطح رویی صیقلی (Front Cap with Metallic Gradient & Subtle Glow)
  const frontCanvas = document.createElement('canvas');
  frontCanvas.width = canvasWidth;
  frontCanvas.height = canvasHeight;
  const fCtx = frontCanvas.getContext('2d');
  fCtx.font = fontStr;
  fCtx.textAlign = 'center';
  fCtx.textBaseline = 'middle';

  // هاله نوری بسیار ظریف و کنترل‌شده
  fCtx.shadowColor = isDark ? 'rgba(96, 165, 250, 0.55)' : 'rgba(33, 54, 104, 0.35)';
  fCtx.shadowBlur = 14;

  const capGrad = fCtx.createLinearGradient(0, canvasHeight * 0.2, 0, canvasHeight * 0.8);
  if (isDark) {
    capGrad.addColorStop(0, '#ffffff');
    capGrad.addColorStop(0.55, '#f1f5f9');
    capGrad.addColorStop(1, '#93c5fd');
  } else {
    capGrad.addColorStop(0, '#17274d');
    capGrad.addColorStop(0.5, '#213668');
    capGrad.addColorStop(1, '#3b82f6');
  }
  fCtx.fillStyle = capGrad;
  fCtx.fillText(text, canvasWidth / 2, canvasHeight / 2);

  // خط هایلایت لبه‌های پخ (Bevel Specular Edge)
  fCtx.shadowBlur = 0;
  fCtx.lineWidth = 2.2;
  fCtx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.85)' : 'rgba(147, 197, 253, 0.7)';
  fCtx.strokeText(text, canvasWidth / 2, canvasHeight / 2);

  // ب) تکسچر لایه‌های اکسترود عمق سه‌بعدی (3D Extrusion Side Walls)
  const sideCanvas = document.createElement('canvas');
  sideCanvas.width = canvasWidth;
  sideCanvas.height = canvasHeight;
  const sCtx = sideCanvas.getContext('2d');
  sCtx.font = fontStr;
  sCtx.textAlign = 'center';
  sCtx.textBaseline = 'middle';

  const sideGrad = sCtx.createLinearGradient(0, canvasHeight * 0.2, 0, canvasHeight * 0.8);
  if (isDark) {
    sideGrad.addColorStop(0, '#3b82f6');
    sideGrad.addColorStop(0.5, '#1e3a8a');
    sideGrad.addColorStop(1, '#172554');
  } else {
    sideGrad.addColorStop(0, '#0f172a');
    sideGrad.addColorStop(0.5, '#1e293b');
    sideGrad.addColorStop(1, '#334155');
  }
  sCtx.fillStyle = sideGrad;
  sCtx.lineWidth = 5;
  sCtx.strokeStyle = isDark ? '#2563eb' : '#0f172a';
  sCtx.strokeText(text, canvasWidth / 2, canvasHeight / 2);
  sCtx.fillText(text, canvasWidth / 2, canvasHeight / 2);

  const frontTex = new THREE.CanvasTexture(frontCanvas);
  const sideTex = new THREE.CanvasTexture(sideCanvas);
  frontTex.minFilter = THREE.LinearFilter;
  frontTex.magFilter = THREE.LinearFilter;
  sideTex.minFilter = THREE.LinearFilter;
  sideTex.magFilter = THREE.LinearFilter;

  const worldScale = 0.0029;
  return {
    frontTex,
    sideTex,
    advanceWidth: textWidth * worldScale,
    meshWidth: canvasWidth * worldScale,
    meshHeight: canvasHeight * worldScale,
  };
}

/**
 * ۳. ساخت مش سه‌بعدی واقعی (Volumetric 3D Extruded Mesh) برای هر حرف یا واحد متنی
 */
function buildExtruded3DGlyphMesh(glyphData) {
  const group = new THREE.Group();
  const { frontTex, sideTex, meshWidth, meshHeight } = glyphData;

  const totalDepth = 0.16; // ضخامت واقعی سه‌بعدی در محور Z
  const layers = 14;       // لایه‌های حجمی به هم فشرده برای تشکیل دیواره سه‌بعدی یکپارچه
  const planeGeo = new THREE.PlaneGeometry(meshWidth, meshHeight);

  const sideMat = new THREE.MeshStandardMaterial({
    map: sideTex,
    transparent: true,
    alphaTest: 0.06,
    roughness: 0.35,
    metalness: 0.75,
    side: THREE.DoubleSide,
  });

  const frontMat = new THREE.MeshStandardMaterial({
    map: frontTex,
    transparent: true,
    alphaTest: 0.04,
    roughness: 0.15,
    metalness: 0.4,
    emissive: 0x3b82f6,
    emissiveIntensity: 0.15,
    side: THREE.DoubleSide,
  });

  for (let i = 0; i < layers; i++) {
    const t = i / (layers - 1); // 0 (پشت) تا 1 (جلو)
    const zPos = (t - 0.5) * totalDepth;
    const isFront = i === layers - 1;
    const isBevel = i === layers - 2 || i === 1;

    const mesh = new THREE.Mesh(planeGeo, isFront ? frontMat : sideMat);
    mesh.position.z = zPos;

    // ایجاد پخ ظریف (Bevel) در لایه رویی و پشتی
    if (isFront) {
      mesh.scale.set(0.985, 0.985, 1);
    } else if (isBevel) {
      mesh.scale.set(0.995, 0.995, 1);
    }

    group.add(mesh);
  }

  group.userData = {
    planeGeo,
    sideMat,
    frontMat,
    frontTex,
    sideTex,
  };

  return group;
}

/**
 * ۴. ایجاد CubeTexture استودیویی پرکنتراست اختصاصی برای الماس
 */
function createDiamondStudioCubeMap() {
  const size = 256;
  const canvases = [];

  for (let face = 0; face < 6; face++) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#040814';
    ctx.fillRect(0, 0, size, size);

    const bgGrad = ctx.createRadialGradient(
      size * 0.5,
      size * 0.5,
      size * 0.05,
      size * 0.5,
      size * 0.5,
      size * 0.75
    );
    bgGrad.addColorStop(0, '#1e3a8a');
    bgGrad.addColorStop(0.45, '#0b1528');
    bgGrad.addColorStop(1, '#02040a');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, size, size);

    ctx.fillStyle = '#ffffff';
    if (face === 0 || face === 1) {
      ctx.save();
      ctx.translate(size * 0.5, size * 0.5);
      ctx.rotate(face === 0 ? 0.45 : -0.45);
      ctx.fillRect(-size * 0.45, -size * 0.08, size * 0.9, size * 0.16);
      ctx.fillStyle = '#e0f2fe';
      ctx.fillRect(-size * 0.35, size * 0.18, size * 0.7, size * 0.06);
      ctx.restore();
    } else if (face === 2) {
      const topLight = ctx.createRadialGradient(
        size * 0.5,
        size * 0.5,
        0,
        size * 0.5,
        size * 0.5,
        size * 0.42
      );
      topLight.addColorStop(0, '#ffffff');
      topLight.addColorStop(0.55, '#ffffff');
      topLight.addColorStop(0.8, '#93c5fd');
      topLight.addColorStop(1, 'rgba(4,8,20,0)');
      ctx.fillStyle = topLight;
      ctx.fillRect(0, 0, size, size);
    } else if (face === 4 || face === 5) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(size * 0.12, size * 0.18, size * 0.76, size * 0.11);
      ctx.fillRect(size * 0.22, size * 0.62, size * 0.56, size * 0.08);

      ctx.fillStyle = '#bae6fd';
      ctx.beginPath();
      ctx.arc(size * 0.75, size * 0.42, size * 0.11, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = '#e0f2fe';
      ctx.fillRect(size * 0.2, size * 0.2, size * 0.6, size * 0.12);
    }

    canvases.push(canvas);
  }

  const cubeTexture = new THREE.CubeTexture(canvases);
  cubeTexture.needsUpdate = true;
  return cubeTexture;
}

/**
 * ۵. ساخت هندسه دقیق برش برلیان (True 58-Facet Style Round Brilliant Cut)
 */
function createBrilliantDiamondGeometry(scale = 1.15) {
  const N = 8;
  const segs = N * 2;

  const rTable = 0.56 * scale;
  const rStar = 0.76 * scale;
  const rGirdle = 1.0 * scale;
  const rPavMid = 0.42 * scale;

  const yTable = 0.36 * scale;
  const yStar = 0.25 * scale;
  const yGirdleTop = 0.06 * scale;
  const yGirdleBot = 0.015 * scale;
  const yPavMid = -0.42 * scale;
  const yCulet = -0.82 * scale;

  const positions = [];

  const addTri = (a, b, c) => {
    positions.push(a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z);
  };

  const pt = (r, angle, y) =>
    new THREE.Vector3(Math.cos(angle) * r, y, Math.sin(angle) * r);

  const centerTable = new THREE.Vector3(0, yTable, 0);
  const culet = new THREE.Vector3(0, yCulet, 0);

  const tablePts = [];
  const starPts = [];
  const girdleTopPts = [];
  const girdleBotPts = [];
  const pavMidPts = [];

  for (let i = 0; i < N; i++) {
    const aMain = (i / N) * Math.PI * 2;
    const aHalf = ((i + 0.5) / N) * Math.PI * 2;
    tablePts.push(pt(rTable, aMain, yTable));
    starPts.push(pt(rStar, aHalf, yStar));
    pavMidPts.push(pt(rPavMid, aMain, yPavMid));
  }

  for (let j = 0; j < segs; j++) {
    const a = (j / segs) * Math.PI * 2;
    girdleTopPts.push(pt(rGirdle, a, yGirdleTop));
    girdleBotPts.push(pt(rGirdle, a, yGirdleBot));
  }

  for (let i = 0; i < N; i++) {
    const iNext = (i + 1) % N;
    const iPrev = (i - 1 + N) % N;

    const gMain = i * 2;
    const gHalf = (i * 2 + 1) % segs;
    const gNextMain = ((i + 1) * 2) % segs;

    addTri(centerTable, tablePts[iNext], tablePts[i]);
    addTri(tablePts[i], tablePts[iNext], starPts[i]);
    addTri(tablePts[i], starPts[i], girdleTopPts[gMain]);
    addTri(tablePts[i], girdleTopPts[gMain], starPts[iPrev]);
    addTri(starPts[i], girdleTopPts[gHalf], girdleTopPts[gMain]);
    addTri(starPts[i], girdleTopPts[gNextMain], girdleTopPts[gHalf]);
    addTri(girdleTopPts[gMain], girdleTopPts[gHalf], girdleBotPts[gMain]);
    addTri(girdleTopPts[gHalf], girdleBotPts[gHalf], girdleBotPts[gMain]);
    addTri(girdleTopPts[gHalf], girdleTopPts[gNextMain], girdleBotPts[gHalf]);
    addTri(girdleTopPts[gNextMain], girdleBotPts[gNextMain], girdleBotPts[gHalf]);
    addTri(girdleBotPts[gMain], girdleBotPts[gHalf], pavMidPts[i]);
    addTri(girdleBotPts[gHalf], girdleBotPts[gNextMain], pavMidPts[iNext]);
    addTri(girdleBotPts[gHalf], pavMidPts[iNext], pavMidPts[i]);
    addTri(pavMidPts[i], pavMidPts[iNext], culet);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.computeVertexNormals();
  return geometry;
}

/**
 * ۶. شیدر کریستالی الماس با انکسار سه کاناله و بازتاب داخلی
 */
function createDiamondOpticalMaterial(studioCubeMap) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uEnvMap: { value: studioCubeMap },
      uOpacity: { value: 0.0 },
      uIsDark: { value: 1.0 },
      uTime: { value: 0.0 },
    },
    vertexShader: `
      varying vec3 vWorldNormal;
      varying vec3 vViewDir;
      varying vec3 vLocalNormal;
      varying vec3 vWorldPos;

      void main() {
        vec4 worldPos = modelMatrix * vec4(position, 1.0);
        vWorldPos = worldPos.xyz;
        vWorldNormal = normalize(mat3(modelMatrix) * normal);
        vLocalNormal = normal;
        vViewDir = normalize(cameraPosition - worldPos.xyz);
        gl_Position = projectionMatrix * viewMatrix * worldPos;
      }
    `,
    fragmentShader: `
      uniform samplerCube uEnvMap;
      uniform float uOpacity;
      uniform float uIsDark;
      uniform float uTime;

      varying vec3 vWorldNormal;
      varying vec3 vViewDir;
      varying vec3 vLocalNormal;
      varying vec3 vWorldPos;

      vec3 spectralFire(float t) {
        return 0.5 + 0.5 * cos(6.28318 * (t + vec3(0.0, 0.33, 0.67)));
      }

      void main() {
        vec3 N = normalize(vWorldNormal);
        vec3 V = normalize(vViewDir);
        vec3 I = -V;

        float cosTheta = clamp(abs(dot(N, V)), 0.0, 1.0);
        float F0 = 0.17;
        float fresnel = F0 + (1.0 - F0) * pow(1.0 - cosTheta, 3.5);

        vec3 reflectDir = reflect(I, N);
        vec3 surfaceReflection = textureCube(uEnvMap, reflectDir).rgb;

        float etaR = 1.0 / 2.38;
        float etaG = 1.0 / 2.42;
        float etaB = 1.0 / 2.46;

        vec3 internalNormal = normalize(vLocalNormal * vec3(-1.0, 1.25, -1.0));

        vec3 refrR = refract(I, N, etaR);
        vec3 refrG = refract(I, N, etaG);
        vec3 refrB = refract(I, N, etaB);

        vec3 bounceR = reflect(refrR, internalNormal);
        vec3 bounceG = reflect(refrG, internalNormal);
        vec3 bounceB = reflect(refrB, internalNormal);

        float rSample = textureCube(uEnvMap, refrR).r * 0.45 + textureCube(uEnvMap, bounceR).r * 0.75;
        float gSample = textureCube(uEnvMap, refrG).g * 0.45 + textureCube(uEnvMap, bounceG).g * 0.75;
        float bSample = textureCube(uEnvMap, refrB).b * 0.45 + textureCube(uEnvMap, bounceB).b * 0.75;

        vec3 refractedInterior = vec3(rSample, gSample, bSample);

        float luma = dot(refractedInterior, vec3(0.299, 0.587, 0.114));
        float highContrastLuma = smoothstep(0.12, 0.88, luma);

        vec3 darkFacetTone = mix(vec3(0.08, 0.16, 0.34), vec3(0.03, 0.07, 0.18), uIsDark);
        vec3 brightFacetTone = vec3(0.96, 0.99, 1.0);
        vec3 baseCrystal = mix(darkFacetTone, brightFacetTone, highContrastLuma);

        vec3 dispersionDelta = refractedInterior - vec3(luma);
        vec3 interiorColor = baseCrystal + dispersionDelta * 2.1;

        float facetHash = fract(sin(dot(floor(vLocalNormal * 12.0), vec3(12.9898, 78.233, 37.719))) * 43758.5453);
        float criticalAngleMask = smoothstep(0.42, 0.68, 1.0 - cosTheta) * step(0.52, facetHash);
        float dispersionPhase = dot(N, V) * 3.5 + facetHash * 6.28;
        vec3 rainbowFlash = spectralFire(dispersionPhase) * criticalAngleMask * smoothstep(0.35, 0.9, luma) * 0.52;

        vec3 lightDir1 = normalize(vec3(0.5, 0.8, 0.6));
        vec3 lightDir2 = normalize(vec3(-0.6, 0.4, 0.7));
        vec3 halfVec1 = normalize(lightDir1 + V);
        vec3 halfVec2 = normalize(lightDir2 + V);
        float specFlash = pow(max(dot(N, halfVec1), 0.0), 80.0) * 1.6
                        + pow(max(dot(N, halfVec2), 0.0), 64.0) * 1.1;

        vec3 finalColor = mix(interiorColor, surfaceReflection * 1.25, fresnel);
        finalColor += rainbowFlash;
        finalColor += vec3(1.0) * specFlash;

        float opticalAlpha = clamp(0.76 + fresnel * 0.24 + specFlash * 0.3 + highContrastLuma * 0.18, 0.0, 1.0);

        gl_FragColor = vec4(finalColor, opticalAlpha * uOpacity);
      }
    `,
    transparent: true,
    depthWrite: true,
    side: THREE.DoubleSide,
  });
}

export class HeroCageSceneManager {
  constructor(container, options = {}) {
    this.container = container;
    this.isMobile = options.isMobile || false;
    this.isTablet = options.isTablet || false;
    this.lang = options.lang || 'fa';
    this.reducedMotion = options.reducedMotion || false;

    this.isVisible = true;
    this.disposed = false;
    this.animationFrameId = null;
    this.brandTitleUnits = [];
    this.brandLaunchTweens = [];

    this.scrollState = {
      anticipation: 0,
      breach: 0,
      cageExit: 0,
      journey: 0,
      transform: 0,
    };

    this.init();
  }

  init() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      this.isMobile ? 55 : 46,
      width / height,
      0.1,
      100
    );
    this.camera.position.set(0, 0, this.isMobile ? 8.2 : 7.2);

    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !this.isMobile,
      powerPreference: 'high-performance',
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, this.isMobile ? 1.5 : 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;

    this.container.innerHTML = '';
    this.container.appendChild(this.renderer.domElement);

    this.glowTexture = createGlowTexture();
    this.diamondStudioCubeMap = createDiamondStudioCubeMap();

    this.setupLights();
    this.setupGeometricCage();
    this.setupTrappedParticles();
    this.setupHeroParticleAndDiamond();
    this.setup3DBrandTitle();
    this.updateThemeColors();
    this.setupObservers();

    this.clock = new THREE.Clock();
    if (this.reducedMotion) {
      this.scrollState.anticipation = 1;
      this.scrollState.breach = 1;
      this.scrollState.cageExit = 1;
      this.scrollState.journey = 1;
      this.scrollState.transform = 1;
    }
    this.animate();
  }

  setupLights() {
    this.ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
    this.scene.add(this.ambientLight);

    this.brandLight = new THREE.PointLight(0x3b82f6, 14, 25);
    this.brandLight.position.set(4, 4, 5);
    this.scene.add(this.brandLight);

    this.rimLight = new THREE.DirectionalLight(0xe0f2fe, 3.5);
    this.rimLight.position.set(-5, 3, 4);
    this.scene.add(this.rimLight);

    this.warmLight = new THREE.PointLight(0x93c5fd, 8, 20);
    this.warmLight.position.set(0, -4, 3);
    this.scene.add(this.warmLight);
  }

  /**
   * ساخت و پرتاب سه‌بعدی نام برند (ALPHA GLOW AGENCY / آژانس آلفا گلو)
   * دقیقاً در زیر نوبار و بالای قفس هندسی، با پرتاب از پشت دوربین و دنباله شهاب‌سنگی
   */
  setup3DBrandTitle() {
    this.clearBrandTitle();

    this.brandTitleGroup = new THREE.Group();
    this.brandBaseY = this.isMobile ? 1.85 : 2.15;
    this.brandTitleGroup.position.set(0, this.brandBaseY, 0);
    this.scene.add(this.brandTitleGroup);

    this.cageBaseY = this.isMobile ? -0.32 : -0.38;

    const isDark = document.documentElement.classList.contains('dark');
    // REQUIREMENT 1: Always enforce English typography and font family for the brand title
    const fontFamily = '"Inter", system-ui, sans-serif';
    const brandText = 'Alpha Glow Agency';

    const rawTokens = Array.from(brandText);
    const letterSpacing = 0.055;
    const spaceAdvance = 0.24;

    const builtItems = [];
    let totalWidth = 0;

    for (let i = 0; i < rawTokens.length; i++) {
      const token = rawTokens[i];
      if (token === ' ') {
        builtItems.push({ isSpace: true, advance: spaceAdvance });
        totalWidth += spaceAdvance;
      } else {
        const glyphData = create3DGlyphTextures(token, fontFamily, isDark);
        const advance = glyphData.advanceWidth + letterSpacing;
        builtItems.push({ isSpace: false, token, glyphData, advance });
        totalWidth += advance;
      }
    }

    // Always LTR layout: start from left (-totalWidth / 2) to right
    let cursorX = -totalWidth / 2;
    const scaleFactor = this.isMobile ? 0.68 : this.isTablet ? 0.85 : 1.0;

    let launchIndex = 0;

    for (let i = 0; i < builtItems.length; i++) {
      const item = builtItems[i];
      if (item.isSpace) {
        cursorX += item.advance;
        continue;
      }

      const halfAdv = item.advance / 2;
      const targetX = cursorX + halfAdv;
      cursorX += item.advance;

      const meshGroup = buildExtruded3DGlyphMesh(item.glyphData);
      meshGroup.scale.setScalar(scaleFactor);

      const targetPos = new THREE.Vector3(targetX * scaleFactor, 0, 0);

      // Launch from behind the camera with LTR spread
      const sideSpread = (targetX * 1.65) - 0.8;
      const startPos = new THREE.Vector3(
        sideSpread,
        1.1 + (launchIndex % 3) * 0.25,
        10.8
      );

      const control1 = new THREE.Vector3(sideSpread * 0.65, 0.75, 6.2);
      const control2 = new THREE.Vector3(targetPos.x * 1.08, 0.18, 1.8);

      const curve = new THREE.CubicBezierCurve3(startPos, control1, control2, targetPos);

      const trailPointsCount = 18;
      const trailPositions = new Float32Array(trailPointsCount * 3);
      for (let t = 0; t < trailPointsCount; t++) {
        trailPositions[t * 3] = startPos.x;
        trailPositions[t * 3 + 1] = startPos.y;
        trailPositions[t * 3 + 2] = startPos.z;
      }

      const trailGeo = new THREE.BufferGeometry();
      trailGeo.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));

      const trailMat = new THREE.LineBasicMaterial({
        color: isDark ? 0x93c5fd : 0x3b82f6,
        transparent: true,
        opacity: 0.0,
        blending: THREE.AdditiveBlending,
      });
      const trailLine = new THREE.Line(trailGeo, trailMat);
      this.brandTitleGroup.add(trailLine);

      const cometHeadMat = new THREE.SpriteMaterial({
        map: this.glowTexture,
        color: 0xe0f2fe,
        transparent: true,
        opacity: 0.0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const cometHead = new THREE.Sprite(cometHeadMat);
      cometHead.scale.set(0.55, 0.55, 1);
      this.brandTitleGroup.add(cometHead);

      this.brandTitleGroup.add(meshGroup);

      const unitState = {
        meshGroup,
        curve,
        targetPos,
        trailLine,
        trailPositions,
        trailPointsCount,
        trailMat,
        cometHead,
        cometHeadMat,
        progress: this.reducedMotion ? 1 : 0,
        trailFade: this.reducedMotion ? 0 : 1,
        started: this.reducedMotion,
      };

      if (this.reducedMotion) {
        meshGroup.position.copy(targetPos);
        meshGroup.rotation.set(0, 0, 0);
      } else {
        meshGroup.position.copy(startPos);
        meshGroup.visible = false;

        const delay = 0.18 + launchIndex * 0.075;

        const tween = gsap.to(unitState, {
          progress: 1,
          duration: 0.92,
          delay,
          ease: 'power3.out',
          onStart: () => {
            unitState.started = true;
            meshGroup.visible = true;
            trailMat.opacity = 0.85;
            cometHeadMat.opacity = 0.9;
          },
          onComplete: () => {
            const fadeTween = gsap.to(unitState, {
              trailFade: 0,
              duration: 0.55,
              ease: 'power2.out',
              onUpdate: () => {
                trailMat.opacity = 0.85 * unitState.trailFade;
                cometHeadMat.opacity = 0.9 * unitState.trailFade;
              },
            });
            this.brandLaunchTweens.push(fadeTween);
          },
        });

        this.brandLaunchTweens.push(tween);
      }

      this.brandTitleUnits.push(unitState);
      launchIndex++;
    }
  }

  clearBrandTitle() {
    if (this.brandLaunchTweens && this.brandLaunchTweens.length) {
      this.brandLaunchTweens.forEach((tw) => tw.kill());
      this.brandLaunchTweens = [];
    }

    if (this.brandTitleUnits && this.brandTitleUnits.length) {
      this.brandTitleUnits.forEach((u) => {
        const ud = u.meshGroup.userData;
        if (ud) {
          ud.planeGeo?.dispose();
          ud.sideMat?.dispose();
          ud.frontMat?.dispose();
          ud.frontTex?.dispose();
          ud.sideTex?.dispose();
        }
        u.trailLine?.geometry?.dispose();
        u.trailMat?.dispose();
        u.cometHeadMat?.dispose();
      });
      this.brandTitleUnits = [];
    }

    if (this.brandTitleGroup) {
      this.scene.remove(this.brandTitleGroup);
      this.brandTitleGroup = null;
    }
  }

  setupGeometricCage() {
    this.cageGroup = new THREE.Group();
    this.cageRadius = this.isMobile ? 1.48 : 1.82;
    this.cageBaseY = this.isMobile ? -0.32 : -0.38;

    const detail = this.isMobile ? 1 : 2;
    const icoGeo = new THREE.IcosahedronGeometry(this.cageRadius, detail);
    const edgesGeo = new THREE.EdgesGeometry(icoGeo, 1);
    icoGeo.dispose();

    const basePositions = edgesGeo.attributes.position.array.slice();
    this.cageBasePositions = basePositions;
    this.cageLineGeometry = edgesGeo;

    this.breachPoint = new THREE.Vector3(0.65, -0.25, 1.0).normalize().multiplyScalar(this.cageRadius);

    this.cageMaterial = new THREE.LineBasicMaterial({
      color: 0x213668,
      transparent: true,
      opacity: 0.72,
    });

    this.cageLines = new THREE.LineSegments(this.cageLineGeometry, this.cageMaterial);
    this.cageGroup.add(this.cageLines);

    const innerGeo = new THREE.IcosahedronGeometry(this.cageRadius * 0.86, 1);
    const innerEdges = new THREE.EdgesGeometry(innerGeo);
    innerGeo.dispose();

    this.innerCageMaterial = new THREE.LineBasicMaterial({
      color: 0x3b82f6,
      transparent: true,
      opacity: 0.22,
    });
    this.innerCageLines = new THREE.LineSegments(innerEdges, this.innerCageMaterial);
    this.cageGroup.add(this.innerCageLines);

    this.scene.add(this.cageGroup);
  }

  setupTrappedParticles() {
    const count = this.isMobile ? 7 : this.isTablet ? 10 : 14;
    this.trappedParticles = [];
    this.particlesGroup = new THREE.Group();
    const maxBound = this.cageRadius * 0.76;
    const trailLength = this.isMobile ? 8 : 14;

    for (let i = 0; i < count; i++) {
      const pos = new THREE.Vector3(
        (Math.random() - 0.5) * 1.4,
        (Math.random() - 0.5) * 1.4,
        (Math.random() - 0.5) * 1.4
      ).clampLength(0.2, maxBound * 0.85);

      const vel = new THREE.Vector3(
        Math.random() - 0.5,
        Math.random() - 0.5,
        Math.random() - 0.5
      )
        .normalize()
        .multiplyScalar(0.8 + Math.random() * 0.7);

      const spriteMat = new THREE.SpriteMaterial({
        map: this.glowTexture,
        color: i % 2 === 0 ? 0x60a5fa : 0xe0f2fe,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const sprite = new THREE.Sprite(spriteMat);
      const scale = this.isMobile ? 0.22 : 0.28;
      sprite.scale.set(scale, scale, 1);
      sprite.position.copy(pos);
      this.particlesGroup.add(sprite);

      const trailPositions = new Float32Array(trailLength * 3);
      for (let j = 0; j < trailLength; j++) {
        trailPositions[j * 3] = pos.x;
        trailPositions[j * 3 + 1] = pos.y;
        trailPositions[j * 3 + 2] = pos.z;
      }
      const trailGeo = new THREE.BufferGeometry();
      trailGeo.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));

      const trailMat = new THREE.LineBasicMaterial({
        color: 0x60a5fa,
        transparent: true,
        opacity: 0.32,
        blending: THREE.AdditiveBlending,
      });
      const trailLine = new THREE.Line(trailGeo, trailMat);
      this.particlesGroup.add(trailLine);

      this.trappedParticles.push({
        pos,
        vel,
        sprite,
        trailLine,
        trailPositions,
        trailLength,
      });
    }

    this.cageGroup.add(this.particlesGroup);
  }

  setupHeroParticleAndDiamond() {
    this.heroParticleGroup = new THREE.Group();

    const coreMat = new THREE.SpriteMaterial({
      map: this.glowTexture,
      color: 0xffffff,
      transparent: true,
      opacity: 1,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this.heroCoreSprite = new THREE.Sprite(coreMat);
    this.heroCoreSprite.scale.set(0.48, 0.48, 1);
    this.heroParticleGroup.add(this.heroCoreSprite);

    const haloMat = new THREE.SpriteMaterial({
      map: this.glowTexture,
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this.heroHaloSprite = new THREE.Sprite(haloMat);
    this.heroHaloSprite.scale.set(0.95, 0.95, 1);
    this.heroParticleGroup.add(this.heroHaloSprite);

    this.heroTrailLength = 22;
    this.heroTrailPositions = new Float32Array(this.heroTrailLength * 3);
    const heroTrailGeo = new THREE.BufferGeometry();
    heroTrailGeo.setAttribute('position', new THREE.BufferAttribute(this.heroTrailPositions, 3));
    this.heroTrailMat = new THREE.LineBasicMaterial({
      color: 0x93c5fd,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });
    this.heroTrailLine = new THREE.Line(heroTrailGeo, this.heroTrailMat);
    this.scene.add(this.heroTrailLine);

    this.scene.add(this.heroParticleGroup);

    this.burstGroup = new THREE.Group();
    this.burstGroup.position.copy(this.breachPoint);

    const ringGeo = new THREE.RingGeometry(0.05, 0.12, 32);
    this.burstRingMat = new THREE.MeshBasicMaterial({
      color: 0x93c5fd,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    this.burstRing = new THREE.Mesh(ringGeo, this.burstRingMat);
    this.burstRing.lookAt(this.breachPoint.clone().multiplyScalar(2));
    this.burstGroup.add(this.burstRing);

    this.fragments = [];
    const fragCount = this.isMobile ? 8 : 14;
    for (let i = 0; i < fragCount; i++) {
      const fMat = new THREE.SpriteMaterial({
        map: this.glowTexture,
        color: 0xe0f2fe,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
      });
      const fSprite = new THREE.Sprite(fMat);
      fSprite.scale.set(0.16, 0.16, 1);
      const dir = new THREE.Vector3(
        (Math.random() - 0.3) * 1.4,
        (Math.random() - 0.3) * 1.4,
        Math.random() * 1.5
      ).normalize();
      this.burstGroup.add(fSprite);
      this.fragments.push({ sprite: fSprite, dir, speed: 0.6 + Math.random() * 0.9 });
    }
    this.cageGroup.add(this.burstGroup);

    this.diamondGroup = new THREE.Group();
    this.diamondGroup.scale.setScalar(0.0001);
    this.diamondGroup.visible = false;

    const diamondScale = this.isMobile ? 0.95 : 1.22;
    const diamondGeo = createBrilliantDiamondGeometry(diamondScale);

    this.diamondMaterial = createDiamondOpticalMaterial(this.diamondStudioCubeMap);
    this.diamondMesh = new THREE.Mesh(diamondGeo, this.diamondMaterial);
    this.diamondGroup.add(this.diamondMesh);

    const diamondEdgesGeo = new THREE.EdgesGeometry(diamondGeo, 8);
    this.diamondEdgesMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    this.diamondEdges = new THREE.LineSegments(diamondEdgesGeo, this.diamondEdgesMat);
    this.diamondGroup.add(this.diamondEdges);

    const auraMat = new THREE.SpriteMaterial({
      map: this.glowTexture,
      color: 0xe0f2fe,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this.diamondAura = new THREE.Sprite(auraMat);
    this.diamondAura.scale.set(3.1, 3.1, 1);
    this.diamondGroup.add(this.diamondAura);

    this.scene.add(this.diamondGroup);
    this.updateLayoutTargets(this.lang, this.isMobile, this.isTablet);
  }

  updateLayoutTargets(lang, isMobile, isTablet) {
    const langChanged = this.lang !== lang;
    this.lang = lang;
    this.isMobile = isMobile;
    this.isTablet = isTablet;

    if (langChanged && this.scene) {
      this.setup3DBrandTitle();
    }

    const dirFactor = lang === 'en' ? 1 : -1;

    let targetX = dirFactor * (isTablet ? 1.65 : 2.25);
    let targetY = 0.08;
    let targetZ = 1.15;

    if (isMobile) {
      targetX = 0;
      targetY = 1.05;
      targetZ = 0.85;
    }

    this.diamondTargetPos = new THREE.Vector3(targetX, targetY, targetZ);

    const breachX = isMobile ? 0.3 : dirFactor * 0.58;
    this.breachPoint.set(breachX, -0.35, 0.95).normalize().multiplyScalar(this.cageRadius);
    if (this.burstGroup) {
      this.burstGroup.position.copy(this.breachPoint);
      this.burstRing.lookAt(this.breachPoint.clone().multiplyScalar(2));
    }

    const startWorldBreach = this.breachPoint.clone().add(new THREE.Vector3(0, this.cageBaseY || -0.38, 0));
    const control1 = startWorldBreach.clone().add(new THREE.Vector3(dirFactor * 0.85, -0.55, 1.35));
    const control2 = new THREE.Vector3(
      targetX * 0.82,
      targetY - 0.45,
      targetZ + 1.1
    );

    this.escapeCurve = new THREE.CubicBezierCurve3(
      startWorldBreach,
      control1,
      control2,
      this.diamondTargetPos.clone()
    );
  }

  updateThemeColors() {
    if (!this.cageMaterial) return;
    const isDark = document.documentElement.classList.contains('dark');

    if (isDark) {
      this.cageMaterial.color.setHex(0xffffff);
      this.cageMaterial.opacity = 0.68;
      this.innerCageMaterial.color.setHex(0x93c5fd);
      this.innerCageMaterial.opacity = 0.22;
      if (this.diamondMaterial?.uniforms) {
        this.diamondMaterial.uniforms.uIsDark.value = 1.0;
      }
      if (this.diamondEdgesMat) {
        this.diamondEdgesMat.color.setHex(0xffffff);
      }
    } else {
      this.cageMaterial.color.setHex(0x213668);
      this.cageMaterial.opacity = 0.82;
      this.innerCageMaterial.color.setHex(0x213668);
      this.innerCageMaterial.opacity = 0.28;
      if (this.diamondMaterial?.uniforms) {
        this.diamondMaterial.uniforms.uIsDark.value = 0.0;
      }
      if (this.diamondEdgesMat) {
        this.diamondEdgesMat.color.setHex(0xe0f2fe);
      }
    }

    // بازسازی تکسچر متالیک حروف سه‌بعدی در صورت تغییر تم
    if (this.brandTitleUnits && this.brandTitleUnits.length > 0) {
      const isPersian = this.lang === 'fa';
      const fontFamily = isPersian
        ? '"Vazirmatn", system-ui, sans-serif'
        : '"Inter", system-ui, sans-serif';

      this.brandTitleUnits.forEach((u) => {
        const ud = u.meshGroup.userData;
        if (ud && u.meshGroup) {
          // رنگ دنباله متناسب با تم
          u.trailMat.color.setHex(isDark ? 0x93c5fd : 0x3b82f6);
        }
      });

      // اگر حروف قبلاً در جای خود نشسته‌اند، رنگ متریالشان با تم هماهنگ می‌شود
      if (this._lastThemeDark !== undefined && this._lastThemeDark !== isDark) {
        this.setup3DBrandTitle();
      }
      this._lastThemeDark = isDark;
    }
  }

  updateCageDeformation(anticipation, breach) {
    const posAttr = this.cageLineGeometry.attributes.position;
    const base = this.cageBasePositions;
    const bp = this.breachPoint;

    const v = new THREE.Vector3();
    const diff = new THREE.Vector3();

    for (let i = 0; i < posAttr.count; i++) {
      const idx = i * 3;
      v.set(base[idx], base[idx + 1], base[idx + 2]);

      const dist = v.distanceTo(bp);
      const influenceRadius = this.cageRadius * 0.62;

      if (dist < influenceRadius) {
        const factor = 1 - dist / influenceRadius;
        const pulse = anticipation * (1 - breach) * 0.08 * factor;
        const pushOut = breach * 0.68 * Math.pow(factor, 1.5);

        diff.subVectors(v, bp).normalize();
        const normalOut = v.clone().normalize();

        v.addScaledVector(normalOut, pulse + pushOut * 0.75);
        v.addScaledVector(diff, pushOut * 0.65);
      }

      posAttr.setXYZ(i, v.x, v.y, v.z);
    }

    posAttr.needsUpdate = true;
  }

  setupObservers() {
    this.handleResize = () => {
      if (this.disposed) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
    };
    window.addEventListener('resize', this.handleResize);

    this.themeObserver = new MutationObserver(() => {
      this.updateThemeColors();
    });
    this.themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          this.isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.01 }
    );
    this.intersectionObserver.observe(this.container);
  }

  animate = () => {
    if (this.disposed) return;
    this.animationFrameId = requestAnimationFrame(this.animate);

    if (!this.isVisible) return;

    const delta = Math.min(this.clock.getDelta(), 0.05);
    const elapsed = this.clock.getElapsedTime();

    const { anticipation, breach, cageExit, journey, transform } = this.scrollState;

    const exitDistanceY = this.isMobile ? 7.2 : 7.8;
    const upwardY = cageExit * exitDistanceY;
    const floatOffsetY = !this.reducedMotion
      ? Math.sin(elapsed * 0.8) * 0.06 * (1 - cageExit)
      : 0;

    this.cageGroup.position.y = (this.cageBaseY || -0.38) + upwardY + floatOffsetY;

    // ۱. بروزرسانی پرتاب سه‌بعدی حروف نام برند و دنباله شهاب‌سنگی آن‌ها
    if (this.brandTitleGroup) {
      this.brandTitleGroup.position.y = this.brandBaseY + upwardY * 0.85;
      this.brandTitleGroup.visible = cageExit < 0.95;

      const curPos = new THREE.Vector3();
      for (let i = 0; i < this.brandTitleUnits.length; i++) {
        const u = this.brandTitleUnits[i];
        if (!u.started) continue;

        u.curve.getPoint(u.progress, curPos);
        u.meshGroup.position.copy(curPos);

        // چرخش سه‌بعدی سینمایی در حین پرواز از عمق فضا تا نشستن کاملاً صاف در جایگاه نهایی
        const rem = 1 - u.progress;
        u.meshGroup.rotation.x = rem * 0.85;
        u.meshGroup.rotation.y = rem * (this.lang === 'fa' ? -1.15 : 1.15);
        u.meshGroup.rotation.z = rem * 0.25;

        u.cometHead.position.copy(curPos);

        // بروزرسانی دنباله شهاب‌سنگی پشت هر حرف
        const tArr = u.trailPositions;
        for (let j = u.trailPointsCount - 1; j > 0; j--) {
          tArr[j * 3] = tArr[(j - 1) * 3];
          tArr[j * 3 + 1] = tArr[(j - 1) * 3 + 1];
          tArr[j * 3 + 2] = tArr[(j - 1) * 3 + 2];
        }
        tArr[0] = curPos.x;
        tArr[1] = curPos.y;
        tArr[2] = curPos.z;
        u.trailLine.geometry.attributes.position.needsUpdate = true;
      }
    }

    if (!this.reducedMotion) {
      const rotInfluence = 1 - Math.min(1, anticipation * 0.85);
      this.cageGroup.rotation.y = Math.sin(elapsed * 0.25) * 0.28 * rotInfluence;
      this.cageGroup.rotation.x = Math.cos(elapsed * 0.2) * 0.15 * rotInfluence;
    }

    const isDark = document.documentElement.classList.contains('dark');
    const baseCageOpacity = isDark ? 0.68 : 0.82;
    const edgeVisibility = 1 - Math.max(0, (cageExit - 0.75) / 0.25);

    this.cageMaterial.opacity = baseCageOpacity * edgeVisibility;
    this.innerCageMaterial.opacity = (isDark ? 0.22 : 0.28) * edgeVisibility;
    this.cageGroup.visible = cageExit < 0.99;

    const maxBound = this.cageRadius * 0.76;
    for (let i = 0; i < this.trappedParticles.length; i++) {
      const p = this.trappedParticles[i];
      if (!this.reducedMotion) {
        p.pos.addScaledVector(p.vel, delta);

        if (p.pos.length() > maxBound) {
          const normal = p.pos.clone().normalize();
          p.vel.reflect(normal);
          p.pos.copy(normal.multiplyScalar(maxBound * 0.98));
        }
      }

      p.sprite.position.copy(p.pos);
      p.sprite.material.opacity = 0.85 * edgeVisibility;

      const arr = p.trailPositions;
      for (let j = p.trailLength - 1; j > 0; j--) {
        arr[j * 3] = arr[(j - 1) * 3];
        arr[j * 3 + 1] = arr[(j - 1) * 3 + 1];
        arr[j * 3 + 2] = arr[(j - 1) * 3 + 2];
      }
      arr[0] = p.pos.x;
      arr[1] = p.pos.y;
      arr[2] = p.pos.z;
      p.trailLine.geometry.attributes.position.needsUpdate = true;
      p.trailLine.material.opacity = 0.3 * edgeVisibility;
    }

    this.updateCageDeformation(anticipation, breach);

    const orbitPos = new THREE.Vector3(
      Math.cos(elapsed * 1.7) * 0.55,
      Math.sin(elapsed * 2.1) * 0.45,
      Math.sin(elapsed * 1.3) * 0.55
    );

    const currentHeroPos = new THREE.Vector3();
    if (journey <= 0.001) {
      currentHeroPos.lerpVectors(orbitPos, this.breachPoint, anticipation);
      currentHeroPos.add(this.cageGroup.position);
    } else {
      this.escapeCurve.getPoint(journey, currentHeroPos);
    }

    this.heroParticleGroup.position.copy(currentHeroPos);

    if (anticipation <= 0.001 && journey <= 0.001 && !this.trailInitialized) {
      for (let j = 0; j < this.heroTrailLength; j++) {
        this.heroTrailPositions[j * 3] = currentHeroPos.x;
        this.heroTrailPositions[j * 3 + 1] = currentHeroPos.y;
        this.heroTrailPositions[j * 3 + 2] = currentHeroPos.z;
      }
      this.trailInitialized = true;
    }

    const particleVisibility = 1 - Math.min(1, Math.max(0, (transform - 0.35) / 0.55));
    const energyBoost = 1 + anticipation * 0.5 + breach * 0.6 + journey * 0.4;
    this.heroCoreSprite.scale.setScalar(0.45 * energyBoost * particleVisibility);
    this.heroHaloSprite.scale.setScalar(0.95 * energyBoost * particleVisibility);
    this.heroCoreSprite.material.opacity = particleVisibility;
    this.heroHaloSprite.material.opacity = 0.75 * particleVisibility;

    const hArr = this.heroTrailPositions;
    for (let j = this.heroTrailLength - 1; j > 0; j--) {
      hArr[j * 3] = hArr[(j - 1) * 3];
      hArr[j * 3 + 1] = hArr[(j - 1) * 3 + 1];
      hArr[j * 3 + 2] = hArr[(j - 1) * 3 + 2];
    }
    hArr[0] = currentHeroPos.x;
    hArr[1] = currentHeroPos.y;
    hArr[2] = currentHeroPos.z;
    this.heroTrailLine.geometry.attributes.position.needsUpdate = true;
    this.heroTrailMat.opacity = 0.65 * particleVisibility;

    const burstEnvelope = Math.sin(breach * Math.PI);
    this.burstRing.scale.setScalar(1 + breach * 8.5);
    this.burstRingMat.opacity = burstEnvelope * 0.75 * edgeVisibility;

    for (let i = 0; i < this.fragments.length; i++) {
      const f = this.fragments[i];
      f.sprite.position.copy(f.dir).multiplyScalar(breach * f.speed * 1.4);
      f.sprite.material.opacity = burstEnvelope * 0.9 * edgeVisibility;
    }

    if (transform > 0.01) {
      this.diamondGroup.visible = true;
      this.diamondGroup.position.copy(currentHeroPos);

      const easeTransform = 1 - Math.pow(1 - transform, 3);
      this.diamondGroup.scale.setScalar(Math.max(0.001, easeTransform));

      this.diamondMaterial.uniforms.uOpacity.value = easeTransform;
      this.diamondMaterial.uniforms.uTime.value = elapsed;
      this.diamondEdgesMat.opacity = easeTransform * (isDark ? 0.38 : 0.45);
      this.diamondAura.material.opacity = easeTransform * 0.35;

      if (!this.reducedMotion) {
        const rotY = elapsed * 0.35 + (1 - easeTransform) * Math.PI;
        this.diamondMesh.rotation.set(0, rotY, 0);
        this.diamondEdges.rotation.set(0, rotY, 0);
      }
    } else {
      this.diamondGroup.visible = false;
    }

    this.renderer.render(this.scene, this.camera);
  };

  dispose() {
    this.disposed = true;
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
    window.removeEventListener('resize', this.handleResize);
    if (this.themeObserver) this.themeObserver.disconnect();
    if (this.intersectionObserver) this.intersectionObserver.disconnect();

    this.clearBrandTitle();

    this.scene.traverse((obj) => {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        if (Array.isArray(obj.material)) {
          obj.material.forEach((m) => m.dispose());
        } else {
          obj.material.dispose();
        }
      }
    });

    if (this.glowTexture) this.glowTexture.dispose();
    if (this.diamondStudioCubeMap) this.diamondStudioCubeMap.dispose();
    if (this.renderer) {
      this.renderer.dispose();
      if (this.renderer.domElement && this.renderer.domElement.parentNode) {
        this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
      }
    }
  }
}