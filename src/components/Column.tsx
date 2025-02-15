"use client";

import React, { useState, useEffect } from "react";

interface ColumnProps {
  id: string;
  defaultTitle: string;
  onDelete: (id: string) => void;
}

const Column: React.FC<ColumnProps> = ({ id, defaultTitle, onDelete }) => {
  const [title, setTitle] = useState<string>(defaultTitle);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // 로컬스토리지에서 title 불러오기
  useEffect(() => {
    const savedData = localStorage.getItem(`column-${id}`);
    if (savedData) {
      try {
        const { title: savedTitle } = JSON.parse(savedData);
        if (savedTitle) {
          setTitle(savedTitle);
        }
      } catch (error) {
        console.error(`컬럼(${id}) 데이터를 파싱하는 데 실패했습니다.`, error);
      }
    }
  }, [id]);

  // title이 변경될 때마다 로컬스토리지에 저장
  useEffect(() => {
    localStorage.setItem(`column-${id}`, JSON.stringify({ title }));
  }, [id, title]);

  const handleTitleClick = () => setIsEditing(true);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setTitle(e.target.value);
  const handleInputBlur = () => setIsEditing(false);
  const handleDelete = () => {
    localStorage.removeItem(`column-${id}`);
    onDelete(id);
  };

  return (
    <div className="flex flex-col w-80 min-h-56 items-start p-4 bg-gray-100 rounded-lg shadow-md">
      <div>
        {isEditing ? (
          <input
            type="text"
            value={title}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            autoFocus
            className="text-xl font-semibold border border-gray-300 rounded p-1 mb-2"
          />
        ) : (
          <h2
            className="text-xl font-semibold cursor-pointer mb-2 hover:underline"
            onClick={handleTitleClick}
          >
            {title}
          </h2>
        )}
      </div>
      <button onClick={handleDelete} className="text-sm text-red-500 mb-4">
        컬럼 삭제
      </button>

      {/* 카드 영역 예시 */}
      <div className="bg-white p-4 rounded-lg shadow-md mt-2 w-full">
        <div className="flex items-center justify-between">
          <p className="text-sm">카드 내용</p>
          <button className="text-sm text-red-500">카드 삭제</button>
        </div>
      </div>
    </div>
  );
};

export default Column;
