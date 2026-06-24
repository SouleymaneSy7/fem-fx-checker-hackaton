import { Star } from "lucide-react";

import Title from "@/components/common/title";
import { ArrowLeftRightIcon, DeleteIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <div className="container space-y-step-400">
      <Title level="h1" className="preset-1">
        Style guide page
      </Title>

      <Title level="h2" className="preset-2 font-bold">
        Button:
      </Title>

      <div className="flex flex-col gap-step-100">
        <div className="space-y-step-150">
          <Title level="h3" className="preset-3 font-bold">
            Clear All - Button
          </Title>

          <div className="flex items-center gap-step-150 w-full max-w-30">
            <Button variant={"secondary"}>Clear All</Button>
            <p>Default</p>
          </div>
        </div>
      </div>

      <div className="space-y-step-150">
        <Title level="h3" className="preset-3 font-bold">
          Delete - Button
        </Title>

        <div className="flex flex-col items-start">
          <div className="flex items-center gap-step-150 w-full max-w-30">
            <Button variant={"secondary"} size={"icon"}>
              <DeleteIcon />
            </Button>

            <p>Default</p>
          </div>
        </div>
      </div>

      <div className="space-y-step-150">
        <Title level="h3" className="preset-3 font-bold">
          Exchange/Swap - Button
        </Title>

        <div className="flex flex-col items-start">
          <div className="flex items-center gap-step-150 w-full max-w-30">
            <Button variant={"secondary"} size={"icon-lg"}>
              <ArrowLeftRightIcon />
            </Button>

            <p>Default</p>
          </div>
        </div>
      </div>

      <div className="space-y-step-150">
        <Title level="h3" className="preset-3 font-bold">
          Favorite - Button
        </Title>

        <div className="flex flex-col items-start">
          <div className="flex items-center gap-step-100 w-full max-w-30">
            <Button variant={"default"}>
              <Star /> Favorite
            </Button>

            <p>Default</p>
          </div>

          <div className="flex items-center gap-step-150 w-full max-w-30">
            <Button variant={"primary"}>
              {" "}
              <Star />
              Favorite
            </Button>

            <p>Primary</p>
          </div>
        </div>
      </div>

      <div className="space-y-step-150">
        <Title level="h3" className="preset-3 font-bold">
          Log Conversion - Button
        </Title>

        <div className="flex flex-col items-start">
          <div className="flex items-center gap-step-150 w-full max-w-30">
            <Button variant={"outline"}>Log Conversion</Button>

            <p>Default</p>
          </div>
        </div>
      </div>
    </div>
  );
}
