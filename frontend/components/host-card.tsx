import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

interface HostCardProps {
  id: number;
  name: string;
  location: string;
  rating: number;
  image: string;
}

export function HostCard({ id, name, location, rating, image }: HostCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <Link
          href={{
            pathname: "/host-details",
            query: { id, name, location, rating, image },
          }}
        >
          <Image
            src={image || "/placeholder.svg"}
            alt={name}
            width={600}
            height={400}
            className="object-cover w-full h-48 transition-transform hover:scale-105"
          />
        </Link>
        <div className="p-6">
          <div className="flex justify-between">
            <div>
              <h3 className="text-lg font-bold">{name}</h3>
              <p className="text-sm text-muted-foreground">{location}</p>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-yellow-500 font-medium">{rating} ★</span>
            </div>
          </div>
          <div className="flex items-center justify-end mt-4">
            <Button size="sm" asChild>
              <Link
                href={{
                  pathname: "/host-details",
                  query: { id, name, location, rating, image },
                }}
              >
                View Details
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}