import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ClipPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Clip Dashboard</h1>
        <p className="text-muted-foreground mt-1">Manage your clips here.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Card Content 1</CardTitle>
            <CardDescription>This is the first card section.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Place your content for the first card here.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Card Content 2</CardTitle>
            <CardDescription>This is the second card section.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Place your content for the second card here.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
