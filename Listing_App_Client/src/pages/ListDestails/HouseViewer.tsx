import { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Stage } from '@react-three/drei';

interface HouseViewerProps {
  modelUrl?: string; // Link to the .glb file hosted on Cloudinary
  imageUrl: string;  // Fallback static image if no 3D model exists
}

// Component to handle the asynchronous loading of the 3D asset file
function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

export default function HouseViewer({ modelUrl, imageUrl }: HouseViewerProps) {
  // Tracks whether the user has toggled interactive "move around" mode
  const [isInteractive, setIsInteractive] = useState<boolean>(false);

  // Fallback: If this listing doesn't have a 3D model, just show the standard cover photo
  if (!modelUrl) {
    return (
      <div className="w-full h-[400px] rounded-xl overflow-hidden shadow border border-gray-200">
        <img src={imageUrl} alt="Property Snapshot" className="w-full h-full object-cover" />
      </div>
    );
  }

  return (
    <div className="relative w-full h-[400px] bg-slate-900 rounded-xl overflow-hidden shadow-inner border border-slate-800">
      
      {/* 3D Render Window */}
      <Canvas camera={{ position: [0, 5, 12], fov: 45 }} gl={{ preserveDrawingBuffer: true }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 5]} intensity={1.2} />
        
        {/* Suspense hides the 3D box or keeps it clean until the file downloads completely */}
        <Suspense fallback={null}>
          {/* Stage automatically centers the model and creates studio lighting */}
          <Stage environment="city" intensity={0.5} adjustCamera={true}>
            <Model url={modelUrl} />
          </Stage>
        </Suspense>

        {/* This controls the click-and-drag rotation. Locked until unlocked by the button */}
        <OrbitControls 
          enableZoom={isInteractive} 
          enableRotate={isInteractive} 
          enablePan={isInteractive}
          makeDefault 
        />
      </Canvas>

      {/* Control overlay button */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
        <button
          type="button"
          onClick={() => setIsInteractive(!isInteractive)}
          className={`px-5 py-2.5 text-white text-sm font-semibold rounded-full shadow transition-all ${
            isInteractive ? 'bg-slate-800 border border-slate-700' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isInteractive ? '🔒 Lock Camera View' : '✨ Rotate & Move 3D Structure'}
        </button>
      </div>

      {/* Mode Indicator Tag */}
      <div className="absolute top-3 left-3 bg-slate-950/50 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded">
        {isInteractive ? '3D Orbit Mode Active' : 'Normal View'}
      </div>
    </div>
  );
}