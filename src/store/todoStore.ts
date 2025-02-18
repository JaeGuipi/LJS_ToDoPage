import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import { create } from "zustand";

// 타입 정의
export interface CardData {
  id: string;
  title: string;
}

export interface ColumnData {
  id: string;
  title: string;
  cards: CardData[];
}

export interface TodoData {
  columns: ColumnData[];
}

// 스토어 인터페이스
interface TodoStore {
  todoData: TodoData;
  addColumn: () => void;
  updateColumn: (updatedColumn: ColumnData) => void;
  deleteColumn: (columnId: string) => void;
  moveColumn: (fromIndex: number, toIndex: number) => void;
  moveCard: (
    sourceColIndex: number,
    destColIndex: number,
    sourceIndex: number,
    destIndex: number
  ) => void;
}

/**
 * Todo 관리를 위한 전역 상태 스토어
 *
 * 주요 기능:
 * - 컬럼 및 카드 데이터 영구 저장
 * - 컬럼 관리 (추가/수정/삭제/이동)
 * - 카드 관리 (추가/수정/삭제)
 */
export const useTodoStore = create<TodoStore>()(
  persist(
    (set) => ({
      todoData: {
        columns: [
          {
            id: uuidv4(),
            title: "할 일",
            cards: [],
          },
          {
            id: uuidv4(),
            title: "진행 중",
            cards: [],
          },
          {
            id: uuidv4(),
            title: "완료",
            cards: [],
          },
        ],
      },
      addColumn: () =>
        set((state) => ({
          todoData: {
            columns: [
              ...state.todoData.columns,
              { id: uuidv4(), title: "새 컬럼", cards: [] },
            ],
          },
        })),
      updateColumn: (updatedColumn: ColumnData) =>
        set((state) => ({
          todoData: {
            columns: state.todoData.columns.map((col) =>
              col.id === updatedColumn.id ? updatedColumn : col
            ),
          },
        })),
      deleteColumn: (columnId: string) =>
        set((state) => ({
          todoData: {
            columns: state.todoData.columns.filter(
              (col) => col.id !== columnId
            ),
          },
        })),
      moveColumn: (fromIndex: number, toIndex: number) =>
        set((state) => {
          const columns = [...state.todoData.columns];
          const [moved] = columns.splice(fromIndex, 1);
          columns.splice(toIndex, 0, moved);
          return {
            todoData: { ...state.todoData, columns },
          };
        }),
      moveCard: (
        sourceColIndex: number,
        destColIndex: number,
        sourceIndex: number,
        destIndex: number
      ) =>
        set((state) => {
          const newColumns = [...state.todoData.columns];
          const sourceCards = [...newColumns[sourceColIndex].cards];
          const destCards =
            sourceColIndex === destColIndex
              ? sourceCards
              : [...newColumns[destColIndex].cards];

          const [movedCard] = sourceCards.splice(sourceIndex, 1);
          destCards.splice(destIndex, 0, movedCard);

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

          return {
            todoData: { ...state.todoData, columns: newColumns },
          };
        }),
    }),
    {
      name: "todoData",
    }
  )
);
