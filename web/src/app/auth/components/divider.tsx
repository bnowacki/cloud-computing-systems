import React from 'react'

const FormDivider = ({ text }: { text: string }) => {
  return (
    <div className="relative py-2">
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t" />
      </div>
      {text && (
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">{text}</span>
        </div>
      )}
    </div>
  )
}

export default FormDivider
