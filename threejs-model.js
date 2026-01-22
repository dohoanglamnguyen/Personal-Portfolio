// Three.js 3D Model Setup
document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('threejs-container');
    if (!container) {
        console.error('Three.js container not found');
        return;
    }

    // Wait for container to have dimensions and GLTFLoader to be available
    function initThreeJS() {
        if (container.clientWidth === 0 || container.clientHeight === 0) {
            setTimeout(initThreeJS, 100);
            return;
        }
        
        // Wait for GLTFLoader to be available
        if (typeof THREE === 'undefined' || typeof THREE.GLTFLoader === 'undefined') {
            setTimeout(initThreeJS, 100);
            return;
        }

        // Scene setup
        const scene = new THREE.Scene();
        scene.background = null; // Transparent background
        

        // Camera setup - adjusted to match image perspective
        // Adjust camera distance based on container size to maintain consistent visual appearance
        const baseContainerSize = 800; // Base container size (standard desktop)
        const containerSize = Math.max(container.clientWidth, container.clientHeight);
        const sizeRatio = containerSize / baseContainerSize;
        // Adjust camera distance: smaller container = closer camera to maintain visual size
        const baseCameraDistance = 8;
        const cameraDistance = baseCameraDistance * sizeRatio; // Smaller container = closer camera
        
        const camera = new THREE.PerspectiveCamera(
            55, // Fixed FOV
            container.clientWidth / container.clientHeight,
            0.1,
            5000 // Increased far plane from 1000 to 5000
        );
        // Camera positioned to match image - distance adjusts with container size
        camera.position.set(0, 0, cameraDistance);
        camera.lookAt(0, 0, 0);
        camera.updateProjectionMatrix();
        console.log('Camera distance:', cameraDistance, 'Container size:', container.clientWidth, 'x', container.clientHeight, 'Size ratio:', sizeRatio);

        // Renderer setup
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(renderer.domElement);
        
        // Enable pointer events on the canvas
        renderer.domElement.style.pointerEvents = 'auto';
        renderer.domElement.style.cursor = 'grab';

    // Lighting - reduced to make model less bright
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Additional light from front - reduced
    const frontLight = new THREE.DirectionalLight(0xffffff, 0.2);
    frontLight.position.set(0, 0, 5);
    scene.add(frontLight);

    // Enable tone mapping for better color rendering - reduced exposure
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.7;

        // Check if GLTFLoader is available
        if (typeof THREE.GLTFLoader === 'undefined') {
            console.error('GLTFLoader is not loaded. Please check the script tag.');
            return;
        }

        // Load GLB model
        const loader = new THREE.GLTFLoader();
        let model = null;
        let controls = null; // Declare controls at function scope
        let maxDimOriginal = null;
        let centerOriginal = null;
        let applyResponsiveScale = null;

        // Load both skull models (up and down)
        const skullUpPath = 'assets a2/3d model/skull up.glb';
        const skullDownPath = 'assets a2/3d model/skull down.glb';
        
        let skullUp = null;
        let skullDown = null;
        let modelsLoaded = 0;
        const totalModels = 2;
        
        // Function to fix materials for a model
        function fixMaterials(modelScene) {
            modelScene.traverse(function(child) {
                if (child.isMesh && child.material) {
                    // Handle material arrays
                    const materials = Array.isArray(child.material) ? child.material : [child.material];
                    const newMaterials = materials.map(function(mat) {
                        if (mat.type === 'MeshBasicMaterial') {
                            console.log('Converting MeshBasicMaterial to MeshStandardMaterial');
                            const newMat = new THREE.MeshStandardMaterial({
                                color: mat.color || 0xffffff,
                                map: mat.map,
                                transparent: mat.transparent,
                                opacity: mat.opacity !== undefined ? mat.opacity : 1.0,
                                emissive: mat.emissive || 0x000000,
                                emissiveIntensity: mat.emissiveIntensity || 0.0
                            });
                            return newMat;
                        }
                        return mat;
                    });
                    child.material = Array.isArray(child.material) ? newMaterials : newMaterials[0];
                }
            });
        }
        
        function onModelLoaded() {
            modelsLoaded++;
            if (modelsLoaded === totalModels) {
                // Both models loaded, combine them
                combineSkullModels();
            }
        }
        
        // Load skull up
        loader.load(
            skullUpPath,
            function(gltf) {
                console.log('Skull up loaded successfully');
                console.log('Skull up scene:', gltf.scene);
                skullUp = gltf.scene;
                skullUp.visible = true;
                fixMaterials(skullUp);
                
                // Check if skullUp has meshes
                let meshCount = 0;
                skullUp.traverse(function(child) {
                    if (child.isMesh) {
                        meshCount++;
                        console.log('Skull up mesh:', child.name || 'unnamed', 'visible:', child.visible);
                    }
                });
                console.log('Skull up mesh count:', meshCount);
                
                onModelLoaded();
            },
            function(xhr) {
                console.log('Skull up: ' + (xhr.loaded / xhr.total * 100) + '% loaded');
            },
            function(error) {
                console.error('Error loading skull up:', error);
                console.error('Path attempted:', skullUpPath);
            }
        );
        
        // Load skull down
        loader.load(
            skullDownPath,
            function(gltf) {
                console.log('Skull down loaded successfully');
                console.log('Skull down scene:', gltf.scene);
                skullDown = gltf.scene;
                skullDown.visible = true;
                fixMaterials(skullDown);
                
                // Check if skullDown has meshes
                let meshCount = 0;
                skullDown.traverse(function(child) {
                    if (child.isMesh) {
                        meshCount++;
                        console.log('Skull down mesh:', child.name || 'unnamed', 'visible:', child.visible);
                    }
                });
                console.log('Skull down mesh count:', meshCount);
                
                onModelLoaded();
            },
            function(xhr) {
                console.log('Skull down: ' + (xhr.loaded / xhr.total * 100) + '% loaded');
            },
            function(error) {
                console.error('Error loading skull down:', error);
                console.error('Path attempted:', skullDownPath);
            }
        );
        
        function combineSkullModels() {
            // Create a parent group to hold both skull parts
            model = new THREE.Group();
            
            // Get bounding boxes BEFORE any transformations
            const boxUp = new THREE.Box3().setFromObject(skullUp);
            const boxDown = new THREE.Box3().setFromObject(skullDown);
            const centerUp = boxUp.getCenter(new THREE.Vector3());
            const centerDown = boxDown.getCenter(new THREE.Vector3());
            const sizeUp = boxUp.getSize(new THREE.Vector3());
            const sizeDown = boxDown.getSize(new THREE.Vector3());
            
            console.log('Skull up center:', centerUp, 'size:', sizeUp);
            console.log('Skull down center:', centerDown, 'size:', sizeDown);
            
            // Center skullUp at origin first
            skullUp.position.sub(centerUp);
            
            // Get skullUp's bounding box after centering
            const boxUpCentered = new THREE.Box3().setFromObject(skullUp);
            const bottomYUp = boxUpCentered.min.y;  // Bottom edge of skull up
            
            // Center skullDown at origin first
            skullDown.position.sub(centerDown);
            
            // Get skullDown's bounding box after centering
            const boxDownCentered = new THREE.Box3().setFromObject(skullDown);
            const topYDown = boxDownCentered.max.y;  // Top edge of skull down (in its local space)
            
            // Position skullDown to overlap with skullUp (negative gap = overlap)
            // The image shows the lower jaw overlapping significantly with the upper part
            const jawGap = -10.0; // More negative = more overlap (increased from -2.0)
            skullDown.position.y = bottomYUp - topYDown - jawGap;
            
            // Move skullDown up a bit
            skullDown.position.y += 2.0; // Adjust this value to control how much up
            
            // Move skullDown slightly to the back (negative Z direction) - reduced for better appearance from all angles
            skullDown.position.z -= 3.0; // Reduced from 6.0 to prevent issues at certain viewing angles
            
            // Store original position for click interaction restoration
            window.originalSkullDownY = skullDown.position.y;
            window.originalSkullDownZ = skullDown.position.z;
            
            console.log('Positioning - skullUp bottom Y:', bottomYUp);
            console.log('Positioning - skullDown top Y (local):', topYDown);
            console.log('Positioning - jawGap:', jawGap);
            console.log('Positioning - skullDown Y position set to:', skullDown.position.y);
            console.log('Result - skullDown top in world space:', skullDown.position.y + topYDown);
            console.log('Gap between skulls:', bottomYUp - (skullDown.position.y + topYDown));
            
            console.log('After alignment - skullUp position:', skullUp.position);
            console.log('After alignment - skullDown position:', skullDown.position);
            console.log('SkullUp bottom Y:', bottomYUp, 'SkullDown top Y (after positioning):', skullDown.position.y + topYDown);
            
            // Verify they're connected (should be equal or very close)
            const actualTopYDown = skullDown.position.y + topYDown;
            const gap = Math.abs(bottomYUp - actualTopYDown);
            console.log('Gap between skulls:', gap, '(should be 0 or very close)');
            
            // Recalculate bounding boxes after positioning to verify connection
            const boxUpFinal = new THREE.Box3().setFromObject(skullUp);
            const boxDownFinal = new THREE.Box3().setFromObject(skullDown);
            console.log('Final skullUp bounds - min Y:', boxUpFinal.min.y, 'max Y:', boxUpFinal.max.y);
            console.log('Final skullDown bounds - min Y:', boxDownFinal.min.y, 'max Y:', boxDownFinal.max.y);
            console.log('Connection check - skullUp bottom:', boxUpFinal.min.y, 'skullDown top:', boxDownFinal.max.y);
            
            // Add both to the model group BEFORE calculating combined bounding box
            model.add(skullUp);
            model.add(skullDown);
            
            console.log('Added skullUp and skullDown to model group');
            console.log('Model group children count:', model.children.length);
            
            console.log('Both skull models combined');
            
            // Fix materials: Convert MeshBasicMaterial to MeshStandardMaterial
            // This prevents errors about emissive properties
            model.traverse(function(child) {
                    if (child.isMesh && child.material) {
                        // Handle material arrays
                        const materials = Array.isArray(child.material) ? child.material : [child.material];
                        const newMaterials = materials.map(function(mat) {
                            if (mat.type === 'MeshBasicMaterial') {
                                console.log('Converting MeshBasicMaterial to MeshStandardMaterial');
                                const newMat = new THREE.MeshStandardMaterial({
                                    color: mat.color || 0xffffff,
                                    map: mat.map,
                                    transparent: mat.transparent,
                                    opacity: mat.opacity !== undefined ? mat.opacity : 1.0,
                                    emissive: mat.emissive || 0x000000,
                                    emissiveIntensity: mat.emissiveIntensity || 0.0
                                });
                                return newMat;
                            }
                            return mat;
                        });
                        child.material = Array.isArray(child.material) ? newMaterials : newMaterials[0];
                    }
            });
            
            // TEMPORARILY: Apply a simple visible material to test if models are loading
            // Keep original materials from the GLB file
            let meshCount = 0;
            model.traverse(function(child) {
                if (child.isMesh) {
                    meshCount++;
                    console.log('Found mesh:', child.name || 'unnamed');
                    console.log('Original material:', child.material);
                    console.log('Mesh position:', child.position);
                    console.log('Mesh visible:', child.visible);
                    
                    // Ensure mesh is visible
                    child.visible = true;
                    child.frustumCulled = false;
                    
                    // Use original material from the GLB file
                    // Ensure it's not transparent
                    if (child.material) {
                        if (child.material.transparent !== undefined) {
                            child.material.transparent = false;
                        }
                        if (child.material.opacity !== undefined) {
                            child.material.opacity = 1.0;
                        }
                        // Increase emissive intensity to make it brighter
                        if (child.material.emissiveIntensity !== undefined) {
                            child.material.emissiveIntensity = child.material.emissiveIntensity * 1.5; // Increased from 0.5
                        }
                        // Increase emissive color brightness
                        if (child.material.emissive) {
                            child.material.emissive.multiplyScalar(1.5); // Increased from 0.5
                        }
                        console.log('Using original material:', child.material.type);
                    } else {
                        console.log('No material found for mesh');
                    }
                }
            });
            console.log('Total meshes found:', meshCount);
            
            if (meshCount === 0) {
                console.error('No meshes found in model! Model structure:', model);
            }
            
            // Store original unscaled dimensions for responsive recalculation
            const boxOriginal = new THREE.Box3().setFromObject(model);
            const sizeOriginal = boxOriginal.getSize(new THREE.Vector3());
            maxDimOriginal = Math.max(sizeOriginal.x, sizeOriginal.y, sizeOriginal.z);
            centerOriginal = boxOriginal.getCenter(new THREE.Vector3());
            
            console.log('Original model size:', sizeOriginal);
            console.log('Original model center:', centerOriginal);
            console.log('Original max dimension:', maxDimOriginal);
            
            // Function to calculate and apply responsive scale
            applyResponsiveScale = function() {
                // Calculate responsive scale based on viewport size
                // Standard desktop (1440px width): scale = 10
                // Larger desktop: scale increases proportionally
                // Smaller desktop/tablet: scale decreases proportionally
                const standardDesktopWidth = 1440; // Standard desktop width
                const baseTargetSize = 10; // Base target size for standard desktop
                const viewportWidth = window.innerWidth || container.clientWidth;
                
                // Calculate scale multiplier based on viewport width relative to standard desktop
                const scaleMultiplier = viewportWidth / standardDesktopWidth;
                const responsiveTargetSize = baseTargetSize * scaleMultiplier;
                
                let scale = 1.0;
                if (maxDimOriginal > 0.001) {
                    // Use responsive target size that scales with viewport
                    // Use original maxDim for accurate calculation
                    scale = responsiveTargetSize / maxDimOriginal;
                } else {
                    console.warn('Model size is very small, using default scale');
                    scale = 1.0;
                }
                console.log('Scale factor:', scale, 'Viewport width:', viewportWidth, 'Target size:', responsiveTargetSize, 'Container size:', container.clientWidth, 'x', container.clientHeight);
                
                // Reset scale and rotation before applying final transforms
                model.scale.set(1, 1, 1);
                model.rotation.set(0, 0, 0);
                
                // Center the combined model by moving the entire group
                // Don't move individual meshes - move the group instead
                model.position.sub(centerOriginal);
                console.log('Centered combined model at:', model.position);
                
                // Apply uniform scale to model (all axes equally)
                model.scale.set(scale, scale, scale);
                console.log('Applied scale:', scale, 'to model');
                
                return scale;
            }
            
            // Apply responsive scale on initial load
            const initialScale = applyResponsiveScale();
            
            // After scaling, recalculate the center and ensure model is at origin
            // This maintains the relative positions of skullUp and skullDown
            const boxAfterScale = new THREE.Box3().setFromObject(model);
            const centerAfterScale = boxAfterScale.getCenter(new THREE.Vector3());
            
            // Store the relative positions before centering
            const skullUpPosBefore = skullUp.position.clone();
            const skullDownPosBefore = skullDown.position.clone();
            
            // Center the entire group
            model.position.sub(centerAfterScale);
            
            // Verify the relative positions are maintained (they should be, since we moved the group)
            console.log('Recentered model after scale at:', model.position);
            console.log('Center after scale:', centerAfterScale);
            console.log('SkullUp position (relative to group):', skullUp.position);
            console.log('SkullDown position (relative to group):', skullDown.position);
            
            // Verify connection is still maintained after centering
            const boxUpAfterCenter = new THREE.Box3().setFromObject(skullUp);
            const boxDownAfterCenter = new THREE.Box3().setFromObject(skullDown);
            const skullUpBottom = boxUpAfterCenter.min.y;
            const skullDownTop = boxDownAfterCenter.max.y;
            const gapAfterCenter = Math.abs(skullUpBottom - skullDownTop);
            console.log('After centering - skullUp bottom:', skullUpBottom, 'skullDown top:', skullDownTop);
            console.log('Gap after centering:', gapAfterCenter, '(should be 0 or very close)');
            
            // Ensure skullDown stays properly positioned relative to skullUp from all viewing angles
            // Re-verify the Y positioning after all transformations to ensure overlap is maintained
            const finalBoxUp = new THREE.Box3().setFromObject(skullUp);
            const finalBoxDown = new THREE.Box3().setFromObject(skullDown);
            const finalBottomYUp = finalBoxUp.min.y;
            const finalTopYDown = finalBoxDown.max.y;
            
            // If the gap is too large (skullDown moved too far down), adjust it
            const finalGap = finalBottomYUp - finalTopYDown;
            if (finalGap > 2.0) {
                console.log('Adjusting skullDown position - gap too large:', finalGap);
                skullDown.position.y += (finalGap - 2.0); // Adjust to maintain overlap
                // Update stored original position
                window.originalSkullDownY = skullDown.position.y;
            }
            
            // Apply rotation LAST - front view (no rotation, facing forward)
            // This is done after all positioning and centering
            model.rotation.x = 0;
            model.rotation.y = 0; // Front view - no rotation
            model.rotation.z = 0;
            
            // Add OrbitControls for dragging to rotate around the skull
            if (typeof THREE.OrbitControls !== 'undefined') {
                controls = new THREE.OrbitControls(camera, renderer.domElement);
                controls.enableDamping = true;
                controls.dampingFactor = 0.05;
                controls.enableZoom = true;
                controls.enablePan = false;
                controls.target.set(0, 0, 0);
                controls.update();
                console.log('OrbitControls enabled - drag to rotate around skull');
            } else {
                console.warn('OrbitControls not loaded');
            }
            
            // Store references to skull parts for animation
            window.skullUp = skullUp;
            window.skullDown = skullDown;
            window.isSkullOpen = false;
            
            // Click animation disabled as requested
            // renderer.domElement.addEventListener('click', function(event) { ... });
            
            // Force update the rotation
            model.updateMatrix();
            model.updateMatrixWorld(true);
            
            console.log('Applied rotation - front view (Y rotation: 0)');
            console.log('Click on the model to open/close the skull');
            
            console.log('Final model position:', model.position);
            console.log('Final model scale:', model.scale);
            console.log('Final model rotation:', model.rotation);
            
            // Make sure model and all children are visible
            model.visible = true;
            model.traverse(function(child) {
                if (child.isMesh) {
                    child.visible = true;
                    child.frustumCulled = false;
                    console.log('Mesh visibility set:', child.name || 'unnamed', 'visible:', child.visible);
                }
            });
            
            // Make sure camera is looking at the origin (where model should be after recentering)
            // Recalculate camera distance based on current container size
            const currentContainerSize = Math.max(container.clientWidth, container.clientHeight);
            const currentSizeRatio = currentContainerSize / 800;
            const currentCameraDistance = 8 * currentSizeRatio;
            camera.position.set(0, 0, currentCameraDistance);
            camera.lookAt(0, 0, 0);
            camera.updateProjectionMatrix();
            console.log('Camera position:', camera.position);
            console.log('Camera looking at origin (0, 0, 0)');
            
            // Add model to scene
            scene.add(model);
            console.log('Model added to scene');
            console.log('Model position:', model.position);
            console.log('Model scale:', model.scale);
            console.log('Model visible:', model.visible);
            console.log('Scene children count:', scene.children.length);
            
            // Verify model is in scene
            const modelInScene = scene.children.includes(model);
            console.log('Model is in scene:', modelInScene);
            
            // Check world position and bounding box
            const worldPos = new THREE.Vector3();
            model.getWorldPosition(worldPos);
            console.log('Model world position:', worldPos);
            
            // Get final bounding box after all transformations
            const finalBox = new THREE.Box3().setFromObject(model);
            console.log('Final bounding box min:', finalBox.min);
            console.log('Final bounding box max:', finalBox.max);
            console.log('Final bounding box size:', finalBox.getSize(new THREE.Vector3()));
            
            // Log all meshes in scene to verify they're there
            let sceneMeshCount = 0;
            scene.traverse(function(obj) {
                if (obj.isMesh) {
                    sceneMeshCount++;
                    console.log('Scene mesh found:', obj.name || 'unnamed', 
                        'position:', obj.position, 
                        'scale:', obj.scale,
                        'visible:', obj.visible,
                        'material:', obj.material ? obj.material.type : 'none');
                }
            });
            console.log('Total meshes in scene:', sceneMeshCount);
            
            // Force render AFTER adding model
            renderer.render(scene, camera);
            console.log('Forced render after model load');
        }

        // Animation
        let time = 0;
        function animate() {
            requestAnimationFrame(animate);
            
            time += 0.01;
            
            // Don't rotate the model - keep it static
            if (model) {
                // model.rotation.y += 0.01; // DISABLED - keep model static
                
                // Update the shader's time uniform for any time-based effects
                model.traverse(function(child) {
                    if (child.isMesh && child.material && child.material.uniforms) {
                        child.material.uniforms.time.value = time;
                    }
                });
            }
            
            renderer.render(scene, camera);
        }
        

        // Handle window resize
        function handleResize() {
            if (container.clientWidth > 0 && container.clientHeight > 0) {
                camera.aspect = container.clientWidth / container.clientHeight;
                
                // Recalculate camera distance based on new container size
                const baseContainerSize = 800;
                const containerSize = Math.max(container.clientWidth, container.clientHeight);
                const sizeRatio = containerSize / baseContainerSize;
                const baseCameraDistance = 8;
                const cameraDistance = baseCameraDistance * sizeRatio;
                camera.position.z = cameraDistance;
                
                camera.updateProjectionMatrix();
                renderer.setSize(container.clientWidth, container.clientHeight);
                
                // Recalculate and reapply responsive scale on resize
                if (model && maxDimOriginal !== null && centerOriginal !== null && applyResponsiveScale) {
                    // Use the applyResponsiveScale function for consistent scaling
                    applyResponsiveScale();
                    console.log('Resize - Scale recalculated, Viewport width:', window.innerWidth || container.clientWidth);
                } else if (model && maxDimOriginal !== null && centerOriginal !== null) {
                    // Fallback: manual recalculation if function not available
                    const standardDesktopWidth = 1440;
                    const baseTargetSize = 10;
                    const viewportWidth = window.innerWidth || container.clientWidth;
                    const scaleMultiplier = viewportWidth / standardDesktopWidth;
                    const responsiveTargetSize = baseTargetSize * scaleMultiplier;
                    
                    const newScale = maxDimOriginal > 0.001 ? responsiveTargetSize / maxDimOriginal : 1.0;
                    
                    // Reset scale and re-center using original center
                    model.scale.set(1, 1, 1);
                    model.position.sub(centerOriginal);
                    
                    // Apply new responsive scale
                    model.scale.set(newScale, newScale, newScale);
                    
                    console.log('Resize - New scale:', newScale, 'Viewport width:', viewportWidth);
                }
                
                // Update OrbitControls if available
                if (controls) {
                    controls.update();
                }
            }
        }

        window.addEventListener('resize', handleResize);
        
        // Start animation
        animate();
    }

    // Initialize after a short delay to ensure container is rendered
    setTimeout(initThreeJS, 100);
});

