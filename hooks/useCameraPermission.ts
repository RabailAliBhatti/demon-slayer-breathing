import { useState, useRef, useCallback } from 'react';
import { useStore } from '../store/useStore';

export function useCameraPermission() {
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const setCamActive = useStore(s => s.setCamActive);

    const requestCamera = useCallback(async () => {
        try {
            if (stream) return;
            const ms = await navigator.mediaDevices.getUserMedia({
                video: { width: 320, height: 240, facingMode: 'user' }
            });
            setStream(ms);
            setHasPermission(true);
            setCamActive(true);
            if (videoRef.current) {
                videoRef.current.srcObject = ms;
            }
        } catch (e) {
            console.error("Camera access denied", e);
            setHasPermission(false);
            setCamActive(false);
        }
    }, [stream, setCamActive]);

    const stopCamera = useCallback(() => {
        if (stream) {
            stream.getTracks().forEach(t => t.stop());
            setStream(null);
        }
        setHasPermission(false);
        setCamActive(false);
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
    }, [stream, setCamActive]);

    return { hasPermission, stream, requestCamera, stopCamera, videoRef };
}
