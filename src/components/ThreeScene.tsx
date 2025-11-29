import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Line, Html } from '@react-three/drei';
import * as THREE from 'three';

const Node = ({ position, color, label }) => {
    return (
        <group position={position}>
            <Sphere args={[0.3, 32, 32]}>
                <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
            </Sphere>
            <Html distanceFactor={10}>
                <div style={{ color: 'white', background: 'rgba(0,0,0,0.5)', padding: '2px 5px', borderRadius: '4px', fontSize: '0.8rem' }}>
                    {label}
                </div>
            </Html>
        </group>
    );
};

const Connection = ({ start, end }) => {
    const points = [start, end];
    return (
        <Line points={points} color="white" lineWidth={1} transparent opacity={0.3} />
    );
};

const SceneContent = () => {
    const groupRef = useRef();

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (groupRef.current) {
            groupRef.current.rotation.y = t * 0.1;
        }
    });

    const nodes = [
        { pos: [-4, 0, 0], label: 'Farm', color: '#4ade80' },
        { pos: [-1.5, 1, 0], label: 'Processing', color: '#facc15' },
        { pos: [1.5, -0.5, 0], label: 'Logistics', color: '#60a5fa' },
        { pos: [4, 0.5, 0], label: 'Retail', color: '#f472b6' },
    ];

    return (
        <group ref={groupRef}>
            {nodes.map((node, i) => (
                <Node key={i} position={node.pos} color={node.color} label={node.label} />
            ))}
            <Connection start={new THREE.Vector3(...nodes[0].pos)} end={new THREE.Vector3(...nodes[1].pos)} />
            <Connection start={new THREE.Vector3(...nodes[1].pos)} end={new THREE.Vector3(...nodes[2].pos)} />
            <Connection start={new THREE.Vector3(...nodes[2].pos)} end={new THREE.Vector3(...nodes[3].pos)} />

            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
        </group>
    );
};

const ThreeScene = () => {
    return (
        <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: -1 }}>
            <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
                <SceneContent />
                <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
            </Canvas>
        </div>
    );
};

export default ThreeScene;
