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
  addCard: (columnId: string) => void;
  updateCard: (columnId: string, cardId: string, newTitle: string) => void;
  deleteCard: (columnId: string, cardId: string) => void;
  moveColumn: (fromIndex: number, toIndex: number) => void;
}

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
      addCard: (columnId: string) =>
        set((state) => ({
          todoData: {
            columns: state.todoData.columns.map((col) =>
              col.id === columnId
                ? {
                    ...col,
                    cards: [...col.cards, { id: uuidv4(), title: "새 카드" }],
                  }
                : col
            ),
          },
        })),
      updateCard: (columnId: string, cardId: string, newTitle: string) =>
        set((state) => ({
          todoData: {
            columns: state.todoData.columns.map((col) =>
              col.id === columnId
                ? {
                    ...col,
                    cards: col.cards.map((card) =>
                      card.id === cardId ? { ...card, title: newTitle } : card
                    ),
                  }
                : col
            ),
          },
        })),
      deleteCard: (columnId: string, cardId: string) =>
        set((state) => ({
          todoData: {
            columns: state.todoData.columns.map((col) =>
              col.id === columnId
                ? {
                    ...col,
                    cards: col.cards.filter((card) => card.id !== cardId),
                  }
                : col
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
    }),
    {
      name: "todoData",
    }
  )
);
