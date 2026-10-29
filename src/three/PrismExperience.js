import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Color,
  Group,
  OctahedronGeometry,
  IcosahedronGeometry,
  MeshPhysicalMaterial,
  MeshBasicMaterial,
  Mesh,
  PointLight,
  DirectionalLight,
  AmbientLight,
  Clock,
  MathUtils,
  ACESFilmicToneMapping,
  SRGBColorSpace,
  PMREMGenerator
} from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

export class PrismExperience {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.clock = new Clock();
    this.animationFrameId = null;

    this.colors = {
      primaryDarkBlue: new Color('#213668'),
      neonGlow: new Color('#38bdf8'),
      pureWhite: new Color('#ffffff')
    };

    this.initScene();
    this.initCamera();
    this.initRenderer();
    this.initEnvironment();
    this.initLights();
    this.createPrismObject();
    this.bindEvents();
    this.animate();
  }

  initScene() {
    this.scene = new Scene();
  }

  initCamera() {
    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new PerspectiveCamera(45, aspect, 0.1, 100);
    this.camera.position.set(0, 0, 7);
  }

  initRenderer() {
    this.renderer = new WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    this.renderer.outputColorSpace = SRGBColorSpace;
  }

  initEnvironment() {
    const pmremGenerator = new PMREMGenerator(this.renderer);
    pmremGenerator.compileEquirectangularShader();
    const roomEnvironment = new RoomEnvironment();
    this.envTexture = pmremGenerator.fromScene(roomEnvironment, 0.04).texture;
    this.scene.environment = this.envTexture;
    roomEnvironment.dispose();
    pmremGenerator.dispose();
  }

  initLights() {
    const ambientLight = new AmbientLight(this.colors.primaryDarkBlue, 1.5);
    this.scene.add(ambientLight);

    const topLight = new DirectionalLight(this.colors.pureWhite, 3.0);
    topLight.position.set(5, 8, 5);
    this.scene.add(topLight);

    const rimLight = new DirectionalLight(this.colors.neonGlow, 2.0);
    rimLight.position.set(-6, -4, -3);
    this.scene.add(rimLight);
  }

  createPrismObject() {
    // گروه والد تحت کنترل GSAP ScrollTrigger
    this.scrollGroup = new Group();
    this.scene.add(this.scrollGroup);

    // گروه فرزند برای حرکت شناور دائمی (Idle Animation)
    this.floatGroup = new Group();
    this.scrollGroup.add(this.floatGroup);

    // پوسته شیشه‌ای منشور
    const prismGeometry = new OctahedronGeometry(1.6, 0);
    this.prismMaterial = new MeshPhysicalMaterial({
      color: this.colors.pureWhite,
      transmission: 1.0,
      opacity: 1.0,
      metalness: 0.0,
      roughness: 0.06,
      ior: 1.45,
      thickness: 2.8,
      attenuationColor: this.colors.primaryDarkBlue,
      attenuationDistance: 2.2,
      specularIntensity: 1.0,
      specularColor: this.colors.pureWhite,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      envMapIntensity: 1.5
    });

    this.prismMesh = new Mesh(prismGeometry, this.prismMaterial);
    this.floatGroup.add(this.prismMesh);

    // هسته نئونی درخشان در مرکز منشور
    const coreGeometry = new IcosahedronGeometry(0.32, 1);
    this.coreMaterial = new MeshBasicMaterial({
      color: this.colors.neonGlow
    });
    this.innerCoreMesh = new Mesh(coreGeometry, this.coreMaterial);
    this.floatGroup.add(this.innerCoreMesh);

    this.innerLight = new PointLight(this.colors.neonGlow, 6.0, 8, 1.5);
    this.innerLight.position.set(0, 0, 0);
    this.floatGroup.add(this.innerLight);
  }

  updateResponsiveScale() {
    const isMobile = window.innerWidth < 768;
    this.floatGroup.scale.setScalar(isMobile ? 0.72 : 1.0);
  }

  onResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.updateResponsiveScale();
  }

  bindEvents() {
    this.handleResize = this.onResize.bind(this);
    window.addEventListener('resize', this.handleResize, { passive: true });
    this.updateResponsiveScale();
  }

  animate() {
    this.animationFrameId = requestAnimationFrame(this.animate.bind(this));

    const elapsedTime = this.clock.getElapsedTime();

    // حرکت شناور نرم در فضا (Idle Floating)
    this.floatGroup.position.y = Math.sin(elapsedTime * 1.4) * 0.18;
    this.floatGroup.rotation.x = Math.sin(elapsedTime * 0.7) * 0.12;
    this.floatGroup.rotation.z = Math.cos(elapsedTime * 0.8) * 0.08;

    // ضربان نوری هسته داخلی
    const pulse = 1 + Math.sin(elapsedTime * 3.0) * 0.12;
    this.innerCoreMesh.scale.setScalar(pulse);
    this.innerLight.intensity = MathUtils.lerp(
      5.0,
      7.5,
      (Math.sin(elapsedTime * 3.0) + 1) * 0.5
    );

    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    window.removeEventListener('resize', this.handleResize);

    if (this.envTexture) this.envTexture.dispose();
    this.prismMesh.geometry.dispose();
    this.prismMaterial.dispose();
    this.innerCoreMesh.geometry.dispose();
    this.coreMaterial.dispose();
    this.renderer.dispose();
  }
}