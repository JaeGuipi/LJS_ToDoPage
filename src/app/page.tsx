"use client";
import { useEffect, useState } from "react";
import Column from "@/components/Column";
import { useTodoStore } from "@/store/todoStore";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  const todoData = useTodoStore((state) => state.todoData);
  const addColumn = useTodoStore((state) => state.addColumn);
  const updateColumn = useTodoStore((state) => state.updateColumn);
  const deleteColumn = useTodoStore((state) => state.deleteColumn);
  const moveColumn = useTodoStore((state) => state.moveColumn);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  // 드래그 종료 이벤트 처리
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination, type } = result;

    // 컬럼 이동
    if (type === "column") {
      if (source.index !== destination.index) {
        moveColumn(source.index, destination.index);
      }
      return;
    }

    // 카드 이동
    const sourceColIndex = todoData.columns.findIndex(
      (col) => col.id === source.droppableId
    );
    const destColIndex = todoData.columns.findIndex(
      (col) => col.id === destination.droppableId
    );

    if (sourceColIndex < 0 || destColIndex < 0) return;

    const newColumns = [...todoData.columns];
    const sourceCards = [...newColumns[sourceColIndex].cards];
    const destCards =
      sourceColIndex === destColIndex
        ? sourceCards
        : [...newColumns[destColIndex].cards];

    // 소스에서 카드 제거
    const [movedCard] = sourceCards.splice(source.index, 1);
    // 목적지에 카드 추가
    destCards.splice(destination.index, 0, movedCard);

    // 컬럼 업데이트
    if (sourceColIndex === destColIndex) {
      newColumns[sourceColIndex] = {
        ...newColumns[sourceColIndex],
        cards: sourceCards,
      };
    } else {
      newColumns[sourceColIndex] = {
        ...newColumns[sourceColIndex],
        cards: sourceCards,
      };
      newColumns[destColIndex] = {
        ...newColumns[destColIndex],
        cards: destCards,
      };
    }

    // 전체 상태 업데이트
    useTodoStore.setState({ todoData: { ...todoData, columns: newColumns } });
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="p-4">
        <h1 className="text-3xl font-bold mb-4">투두 리스트</h1>
        <Droppable droppableId="columns" direction="horizontal" type="column">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="flex flex-wrap gap-4"
            >
              {todoData.columns.map((column, index) => (
                <Draggable
                  key={column.id}
                  draggableId={column.id}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <Column
                        columnData={column}
                        onUpdate={updateColumn}
                        onDelete={deleteColumn}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        <button
          onClick={addColumn}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          컬럼 추가
        </button>
      </div>
    </DragDropContext>
  );
}
