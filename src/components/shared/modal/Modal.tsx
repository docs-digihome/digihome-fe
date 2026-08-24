import type { Dispatch, PropsWithChildren, SetStateAction } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface IModalProps {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>> | ((open: boolean) => void)
}

const ModalRoot = ({
  isOpen,
  setIsOpen,
  children,
}: PropsWithChildren<IModalProps>) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen as (open: boolean) => void}>
      {children}
    </Dialog>
  )
}

const ModalTrigger = ({ children }: PropsWithChildren) => {
  return <DialogTrigger render={children as React.ReactElement} />
}

const ModalContent = ({
  children,
  title,
  description,
  className,
}: PropsWithChildren<{
  title: string
  description: string
  className?: string
}>) => {
  return (
    <DialogContent className={className}>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      {children}
    </DialogContent>
  )
}

export const Modal = Object.assign(ModalRoot, {
  Trigger: ModalTrigger,
  Content: ModalContent,
})
