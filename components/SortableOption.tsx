import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

interface SortableOptionProps {
  id: string;
  index: number;
  opt: { id: string; value: string };
  form: { title: string; options: { id: string; value: string }[] };
  setForm: React.Dispatch<
    React.SetStateAction<{
      title: string;
      options: { id: string; value: string }[];
      category: string;
    }>
  >;
  setUsedOptions: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function SortableOption({
  id,
  index,
  opt,
  form,
  setForm,
  setUsedOptions,
}: SortableOptionProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="flex items-center gap-2 p-2 border rounded-lg"
    >
      <span
        className={`text-gray-400 select-none ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        {...listeners}
      >
        <GripVertical className="h-5 w-5" />
      </span>
      <input
        type="text"
        placeholder={`Option ${index + 1}`}
        value={opt.value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          const newValue = e.target.value;
          const newOptions = [...form.options];
          newOptions[index] = { ...newOptions[index], value: newValue };
          setForm((prev) => ({ ...prev, options: newOptions }));
          if (newValue.trim()) {
            setUsedOptions((prev) => [...new Set([...prev, newValue.trim()])]);
          }
        }}
        className="flex-1 p-2 border rounded cursor-text"
        required
      />
      {form.options.length > 2 && (
        <button
          type="button"
          onClick={() => {
            const newOptions = [...form.options];
            newOptions.splice(index, 1);
            setForm((prev) => ({ ...prev, options: newOptions }));
          }}
          className="p-2 text-red-500 hover:text-red-700"
          aria-label="Remove option"
        >
          ×
        </button>
      )}
    </div>
  );
}
