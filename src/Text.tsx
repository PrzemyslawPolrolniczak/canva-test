import { useDrag } from "react-dnd";
import "./App.css";

export const TextTile = ({ text }: any) => {
  const [{ isDragging }, drag, dragPreview] = useDrag(() => ({
    type: "WIDGET",
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    item: {
      mode: "add",
      type: "text",
      text: "testing",
    },
  }));

  return (
    <span ref={drag} className="draggable">
      Text
    </span>
  );
};

type Offset = {
  x: number;
  y: number;
};

const calculateOffset = (
  itemOffset: Offset | null,
  initialOffset: Offset | null
) => {
  return {
    x: (initialOffset?.x ?? 0) - (itemOffset?.x ?? 0),
    y: (initialOffset?.y ?? 0) - (itemOffset?.y ?? 0),
  };
};

export const Text = ({
  id,
  text,
  rotate,
  onClick,
  isSelected,
  position,
}: any) => {
  const [{ isDragging }, drag, dragPreview] = useDrag(() => ({
    type: "WIDGET",
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    item: () => ({
      id,
      mode: "move",
      type: "text",
      text,
    }),
  }));

  return (
    <span
      className={isSelected ? "selected" : undefined}
      style={{
        position: "absolute",
        left: position?.x || 0,
        top: position?.y || 0,
        transform: `rotate(${rotate ?? 0}deg)`,
      }}
      onClick={() => onClick(id)}
      ref={drag}
    >
      {text}
    </span>
  );
};
