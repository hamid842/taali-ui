import { cn } from "@/lib/utils";
import { useAppStore } from "@/stores/app-store"
import type { ReactNode } from "react";


type Props = {
    children: ReactNode;
    className:string
}

export default function RowView({children,className}:Props) {
    const appStore = useAppStore();
    return (
        <div className={cn(...className,`flex ${appStore.isRTL ? 'flex-row-reverse' : 'flex-row'}`)}>{children}</div>
    )
}