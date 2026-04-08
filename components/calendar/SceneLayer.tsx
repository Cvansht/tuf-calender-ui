import type { SceneLayerData } from "./types";

type SceneLayerProps = {
  layer: SceneLayerData;
};

export function SceneLayer({ layer }: SceneLayerProps) {
  return <div className={`absolute inset-0 ${layer.className ?? ""}`} style={layer.style} />;
}
