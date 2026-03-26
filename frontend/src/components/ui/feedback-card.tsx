import * as React from "react"
import { CheckCircle2, XCircle, AlertCircle, Info, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./card"
import { Button } from "./button"

interface FeedbackCardProps {
  type: "success" | "error" | "warning" | "info"
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  secondaryActionLabel?: string
  onSecondaryAction?: () => void
  className?: string
  icon?: LucideIcon
}

const FeedbackCard: React.FC<FeedbackCardProps> = ({
  type,
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  className,
  icon: CustomIcon
}) => {
  const getIcon = () => {
    if (CustomIcon) return <CustomIcon className="h-16 w-16" />
    
    switch (type) {
      case "success":
        return <CheckCircle2 className="h-16 w-16 text-green-500" />
      case "error":
        return <XCircle className="h-16 w-16 text-destructive" />
      case "warning":
        return <AlertCircle className="h-16 w-16 text-yellow-500" />
      case "info":
        return <Info className="h-16 w-16 text-blue-500" />
    }
  }

  const getBgColor = () => {
    switch (type) {
      case "success": return "bg-green-50/50"
      case "error": return "bg-destructive/5"
      case "warning": return "bg-yellow-50/50"
      case "info": return "bg-blue-50/50"
    }
  }

  return (
    <Card className={cn("max-w-md mx-auto overflow-hidden", getBgColor(), className)}>
      <CardHeader className="text-center pb-2">
        <div className="flex justify-center mb-4 pt-4">
          {getIcon()}
        </div>
        <CardTitle className="text-2xl font-bold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        {description && <p className="text-muted-foreground">{description}</p>}
      </CardContent>
      {(actionLabel || secondaryActionLabel) && (
        <CardFooter className="flex flex-col gap-2 pt-4">
          {actionLabel && (
            <Button onClick={onAction} className="w-full">
              {actionLabel}
            </Button>
          )}
          {secondaryActionLabel && (
            <Button onClick={onSecondaryAction} variant="outline" className="w-full">
              {secondaryActionLabel}
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  )
}

export { FeedbackCard }
