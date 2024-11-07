interface InputFieldProps {
  id: string
  name: string
  type: string
  label: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  error?: string | null
  required?: boolean
}

export function InputField({ id, name, type, label, onChange, error, required }: InputFieldProps) {
  return (
    <div className="mb-1">
      <label htmlFor={id} className="block mb-2">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        onChange={onChange}
        className="w-full p-2 border rounded"
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  )
}
