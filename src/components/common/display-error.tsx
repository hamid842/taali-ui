import { Card, CardContent } from "../ui/card";

export default function DisplayError({ text }: { text: string }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-center text-red-500">{text}</div>
      </CardContent>
    </Card>
  );
}
