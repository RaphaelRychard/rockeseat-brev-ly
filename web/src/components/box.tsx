import { ReactNode } from 'react'

type BoxProps = {
  children: ReactNode
}

export const Box = ({ children }: BoxProps) => {
  return (
    <div className="flex items-center min-h-screen justify-center p-2">
      <div className="bg-card flex flex-col gap-6 items-center rounded-lg text-center px-16 py-12 max-w-[580px]">
        {children}
      </div>
    </div>
  )
}