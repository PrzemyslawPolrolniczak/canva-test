import "./App.css";
import { useDrag, useDrop } from "react-dnd";
import React from "react";
import { Text, TextTile } from "./Text";
import { v4 as uuidv4 } from "uuid";

interface ComponentData {
  type: string;
  id: string;
  position?: {
    x: number;
    y: number;
  };
  props?: any;
}

function App() {
  const [selectedComponentId, setSelectedComponentId] =
    React.useState<string>();
  const [selectedComponent, setSelectedComponent] =
    React.useState<ComponentData>();
  const [frontComponents, setFrontComponents] = React.useState<any>([]);
  const [middleComponents, setMiddleComponents] = React.useState<any>([]);
  const [backComponents, setBackComponents] = React.useState<any>([]);

  React.useEffect(() => {
    if (!selectedComponentId) return;

    const selectedComponent = frontComponents.find(
      (component: ComponentData) => component.id === selectedComponentId
    );

    setFrontComponents((prevState: any[]) => [
      ...prevState.map((item) => ({
        ...item,
        props: { ...item.props, isSelected: item.id === selectedComponentId },
      })),
    ]);

    setSelectedComponent(selectedComponent);
  }, [selectedComponentId]);

  const addOffset = (itemId: string, offset: { x: number; y: number }) =>
    setFrontComponents((prevState: ComponentData[]) => {
      return prevState.map((component) => {
        if (component.id !== itemId) return component;

        return {
          ...component,
          position: offset,
        };
      });
    });

  const [, dropFront] = useDrop(() => ({
    accept: "WIDGET",
    // Props to collect
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
    drop: (item, monitor) => {
      if ((item as any).mode === "add") {
        generateFrontComponent(item);
      } else {
        addOffset(
          (item as any).id,
          monitor.getDifferenceFromInitialOffset() ?? { x: 0, y: 0 }
        );
      }
    },
  }));

  const [__, dropMiddle] = useDrop(() => ({
    accept: "WIDGET",
    drop: (item) => {
      if ((item as any).mode === "add") {
        generateMiddleComponent(item);
      }
    },
  }));

  const [___, dropBack] = useDrop(() => ({
    accept: "WIDGET",
    drop: (item) => {
      if ((item as any).mode === "add") {
        generateBackComponent(item);
      }
    },
  }));

  const handleSelectWidget = (id: string) => {
    setSelectedComponentId(id);
  };

  const handleRemoveWidget = () => {
    setFrontComponents((prevState: any[]) =>
      prevState.filter((item) => item.id !== selectedComponentId)
    );
    setSelectedComponentId(undefined);
  };

  const drawComponents = (listOfComponents: ComponentData[]) => {
    return listOfComponents.map((component) => {
      switch (component.type) {
        case "text":
          return (
            <Text
              key={component.id}
              id={component.id}
              onClick={handleSelectWidget}
              position={component.position}
              {...component.props}
            />
          );
      }
    });
  };

  const generateComponentFactory = (setter: any) => (componentData: any) => {
    const componentId = uuidv4();
    setter((prevState: any) => [
      ...prevState,
      {
        type: "text",
        id: componentId,
        props: {
          text: "Default Text",
        },
      },
    ]);
  };

  const generateFrontComponent = generateComponentFactory(setFrontComponents);
  const generateMiddleComponent = generateComponentFactory(setMiddleComponents);
  const generateBackComponent = generateComponentFactory(setBackComponents);

  const handleInputChange = (event: any) => {
    setSelectedComponent((prevState) => {
      if (!prevState) return;

      return {
        ...prevState,
        props: { ...prevState.props, text: event.target.value },
      };
    });
  };

  const handleRotateChange = (event: any) => {
    setSelectedComponent((prevState) => {
      if (!prevState) return;

      return {
        ...prevState,
        props: { ...prevState.props, rotate: event.target.value },
      };
    });
  };

  const handleApplyChanges = () => {
    setFrontComponents((prevState: any) => [
      ...prevState.filter(
        (component: ComponentData) => component.id !== selectedComponentId
      ),
      selectedComponent,
    ]);
  };

  return (
    <div className="App">
      <header className="App-header">
        <TextTile text="text" />
        <div className="wrapper">
          <div ref={dropFront} className="canvas front-page">
            {drawComponents(frontComponents)}
          </div>

          <div ref={dropMiddle} className="canvas middle-page">
            {drawComponents(middleComponents)}
          </div>

          <div ref={dropBack} className="canvas back-page">
            {drawComponents(backComponents)}
          </div>
        </div>
        <div className="settings">
          {selectedComponentId && (
            <>
              <input
                type="text"
                value={selectedComponent?.props.text || ""}
                onChange={handleInputChange}
              />
              <input
                type="number"
                value={selectedComponent?.props.rotate || 0}
                onChange={handleRotateChange}
              />
              <button onClick={handleApplyChanges}>Apply</button>
              <button onClick={handleRemoveWidget}>Remove</button>
            </>
          )}
        </div>
      </header>
    </div>
  );
}

export default App;
