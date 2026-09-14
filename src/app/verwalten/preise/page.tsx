import BindungsserviceFestlegen from "@/components/preise/bindungsservicefestlegen"
import SkiservicePreiseListe from "@/components/preise/skiservicepreiseliste"
import SkiservicePreisForm from "@/components/preise/skiservicepreisform"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"

export default function PreisePage() {
    return (
        <Tabs defaultValue="overview" className="w-full">
            <TabsList>
                <TabsTrigger value="skiservice">Skiservice</TabsTrigger>
                <TabsTrigger value="bindung">Bindung</TabsTrigger>
                <TabsTrigger value="saisonverleih">Saisonverleih</TabsTrigger>
                <TabsTrigger value="tagesverleih">Tagesverleih</TabsTrigger>
            </TabsList>

            <TabsContent value="skiservice">
                <SkiservicePreisForm />
                <SkiservicePreiseListe />
            </TabsContent>

            <TabsContent value="bindung">
                <BindungsserviceFestlegen />
            </TabsContent>
            <TabsContent value="saisonverleih">
                <Card>
                    <CardHeader>
                        <CardTitle>Saisonverleih</CardTitle>
                        <CardDescription>
                            Generate and download your detailed reports. Export data in
                            multiple formats for analysis.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                        You have 5 reports ready and available to export.
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="tagesverleih">
                <Card>
                    <CardHeader>
                        <CardTitle>Tagesverleih</CardTitle>
                        <CardDescription>
                            Manage your account preferences and options. Customize your
                            experience to fit your needs.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                        Configure notifications, security, and themes.
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    )
}