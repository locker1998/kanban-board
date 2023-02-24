import React, { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { v4 as uuid } from "uuid";

function App() {
  const [cols, setCols] = useState({
    [uuid()]: {
      name: "Column 1",
      items: [
        { id: uuid(), content: "First Task" },
        { id: uuid(), content: "Second Task" },
      ],
    },
    [uuid()]: {
      name: "Column 2",
      items: [],
    },
  });

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const sourceCol = cols[result.source.droppableId];
    const destCol = cols[result.destination.droppableId];
    const sourceItems = [...sourceCol.items];
    const destItems = [...destCol.items];
    const [removed] = sourceItems.splice(result.source.index, 1);
    destItems.splice(result.destination.index, 0, removed);

    setCols({
      ...cols,
      [result.source.droppableId]: {
        ...sourceCol,
        items: sourceItems,
      },
      [result.destination.droppableId]: {
        ...destCol,
        items: destItems,
      },
    });
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", height: "100%" }}>
      <DragDropContext onDragEnd={onDragEnd}>
        {Object.entries(cols).map(([id, col]) => {
          return (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
              }}
              key={id}
            >
              <h2>{col.name}</h2>
              <div style={{ margin: 8 }}>
                <Droppable droppableId={id} key={id}>
                  {(provided, snapshot) => {
                    return (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        style={{
                          background: snapshot.isDraggingOver
                            ? "lightpink"
                            : "lightgrey",
                          padding: 4,
                          width: 250,
                          minHeight: 500
                        }}
                      >
                        {col.items.map((item, index) => {
                          return (
                            <Draggable
                              key={item.id}
                              draggableId={item.id}
                              index={index}
                            >
                              {(provided, snapshot) => {
                                return (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    style={{
                                      userSelect: "none",
                                      padding: 16,
                                      margin: "0 0 8px 0",
                                      minHeight: "50px",
                                      backgroundColor: snapshot.isDragging
                                        ? "darkred"
                                        : "firebrick",
                                      color: "white",
                                      ...provided.draggableProps.style
                                    }}
                                  >
                                    {item.content}
                                  </div>
                                );
                              }}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </div>
                    );
                  }}
                </Droppable>
              </div>
            </div>
          );
        })}
      </DragDropContext>
    </div>
  );
}

export default App;
