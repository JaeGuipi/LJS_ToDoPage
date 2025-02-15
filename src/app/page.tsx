"use client";

import { useState, useEffect } from "react";
import Column from "@/components/Column";
import { v4 as uuvid4 } from "uuid";
import add from "@/../public/ic_add.svg";
import Image from "next/image";

interface ColumnData {
  id: string;
  defaultTitle: string;
}

export default function Home() {
  // lazy initializer를 사용하여 초기 렌더링 시 로컬스토리지 데이터를 우선 사용하고, 없으면 3개의 컬럼으로 초기화
  const [columns, setColumns] = useState<ColumnData[]>(() => {
    const storedColumns = localStorage.getItem("columns");
    if (storedColumns) {
      try {
        return JSON.parse(storedColumns);
      } catch (error) {
        console.error("컬럼 목록을 불러오는 데 실패했습니다.", error);
      }
    }
    // 로컬스토리지에 저장된 데이터가 없으면 초기값으로 3개의 컬럼 생성
    return [
      { id: uuvid4(), defaultTitle: "할 일" },
      { id: uuvid4(), defaultTitle: "진행 중" },
      { id: uuvid4(), defaultTitle: "완료" },
    ];
  });

  // 컬럼 목록이 변경될 때마다 로컬스토리지에 저장
  useEffect(() => {
    localStorage.setItem("columns", JSON.stringify(columns));
  }, [columns]);

  // 새로운 컬럼 생성
  const handleCreateColumn = () => {
    const newColumn: ColumnData = {
      id: uuvid4(),
      defaultTitle: "새 컬럼",
    };
    setColumns((prev) => [...prev, newColumn]);
    console.log(`새로운 컬럼이 생성되었습니다. (id: ${newColumn.id})`);
  };

  // 컬럼 삭제
  const handleDeleteColumn = (id: string) => {
    setColumns((prev) => prev.filter((column) => column.id !== id));
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">투두 리스트</h1>
      <div className="flex gap-4">
        <section className="flex gap-4 pr-2">
          {columns.map((column) => (
            <Column
              key={column.id}
              id={column.id}
              defaultTitle={column.defaultTitle}
              onDelete={handleDeleteColumn}
            />
          ))}
          <button
            onClick={handleCreateColumn}
            className=" mb-4 p-2 bg-gray-100 text-white rounded w-8 h-8 hover:bg-gray-200"
          >
            <Image src={add} alt="추가" width={24} height={24} />
          </button>
        </section>
      </div>
    </div>
  );
}
