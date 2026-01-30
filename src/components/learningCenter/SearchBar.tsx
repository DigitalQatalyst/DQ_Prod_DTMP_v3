import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

export function SearchBar({ value, onChange, placeholder }: SearchBarProps) {
  return (
    <div className="bg-white border-b border-gray-200 px-4 lg:px-8 py-4">
      <div className="max-w-2xl flex items-center gap-3 bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-200 transition-all">
        <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent border-0 outline-none text-gray-900 placeholder:text-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto"
        />
        {value && (
          <button
            onClick={() => onChange("")}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
