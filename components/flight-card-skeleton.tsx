import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function FlightCardSkeleton() {
  return (
    <Card className="w-full bg-prussian_blue border-paynes_gray">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <Skeleton className="h-8 w-48 bg-paynes_gray" />
            <Skeleton className="h-4 w-32 mt-2 bg-paynes_gray" />
          </div>
          <Skeleton className="h-12 w-12 rounded bg-paynes_gray" />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24 bg-paynes_gray" />
            <Skeleton className="h-6 w-40 bg-paynes_gray" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-full bg-paynes_gray" />
              <Skeleton className="h-4 w-full bg-paynes_gray" />
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24 bg-paynes_gray" />
            <Skeleton className="h-6 w-40 bg-paynes_gray" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-full bg-paynes_gray" />
              <Skeleton className="h-4 w-full bg-paynes_gray" />
            </div>
          </div>
        </div>
        <Skeleton className="h-px w-full bg-paynes_gray" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <Skeleton className="h-4 w-24 bg-paynes_gray" />
            <Skeleton className="h-4 w-full bg-paynes_gray" />
            <Skeleton className="h-4 w-full bg-paynes_gray" />
          </div>
          <div className="space-y-1">
            <Skeleton className="h-4 w-24 bg-paynes_gray" />
            <Skeleton className="h-4 w-full bg-paynes_gray" />
            <Skeleton className="h-4 w-full bg-paynes_gray" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
