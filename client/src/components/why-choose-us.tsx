import { Truck, GraduationCap, Clock, Award } from "lucide-react";

export default function WhyChooseUs() {
  const features = [
    {
      icon: Truck,
      title: "Fresh Flowers Guarantee",
      description: "Direct imports and local sourcing ensure maximum freshness and longevity",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: GraduationCap,
      title: "Expert Trainers",
      description: "Learn from certified professionals with international experience",
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      icon: Clock,
      title: "Fast Delivery",
      description: "Same-day delivery across Bengaluru with temperature-controlled transport",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: Award,
      title: "International Certification",
      description: "Globally recognized certificates to advance your floral design career",
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
  ];

  return (
    <section className="section-padding">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Why Choose Bouquet Bar?</h2>
          <p className="text-xl text-muted-foreground">Experience the difference with our premium services</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center space-y-4" data-testid={`feature-${index}`}>
              <div className={`w-16 h-16 ${feature.bgColor} rounded-full flex items-center justify-center mx-auto`}>
                <feature.icon className={`w-8 h-8 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-semibold" data-testid={`feature-title-${index}`}>
                {feature.title}
              </h3>
              <p className="text-muted-foreground" data-testid={`feature-description-${index}`}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
