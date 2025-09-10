import { Card, CardContent } from "@/components/ui/card";
import { Flower, Presentation, Award } from "lucide-react";

export default function AboutSection() {
  return (
    <section id="about" className="section-padding bg-accent/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">About Bouquet Bar</h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Founded with passion for floriculture, Bouquet Bar bridges the gap between beautiful fresh flowers and professional floral education. 
            We're not just a flower shop – we're a complete ecosystem where flower lovers can shop premium arrangements and learn the craft from certified experts.
          </p>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <Card className="card-shadow hover:shadow-xl transition-all" data-testid="card-premium-flowers">
              <CardContent className="p-8 text-center">
                <Flower className="w-12 h-12 text-primary mb-4 mx-auto" />
                <h3 className="text-xl font-semibold mb-2">Premium Flowers</h3>
                <p className="text-muted-foreground">Fresh imports and local varieties delivered with love</p>
              </CardContent>
            </Card>
            <Card className="card-shadow hover:shadow-xl transition-all" data-testid="card-expert-training">
              <CardContent className="p-8 text-center">
                <Presentation className="w-12 h-12 text-secondary mb-4 mx-auto" />
                <h3 className="text-xl font-semibold mb-2">Expert Training</h3>
                <p className="text-muted-foreground">Learn from certified international floral design masters</p>
              </CardContent>
            </Card>
            <Card className="card-shadow hover:shadow-xl transition-all" data-testid="card-certification">
              <CardContent className="p-8 text-center">
                <Award className="w-12 h-12 text-primary mb-4 mx-auto" />
                <h3 className="text-xl font-semibold mb-2">Certification</h3>
                <p className="text-muted-foreground">Internationally recognized diplomas and certificates</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
