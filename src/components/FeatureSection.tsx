import React from 'react';
import { Star, Truck, Shield, Award } from 'lucide-react';

export function FeatureSection() {
  const features = [
    {
      icon: Star,
      title: 'Premium Quality',
      description: 'Only authentic products from trusted brands',
    },
    {
      icon: Truck,
      title: 'Fast Delivery',
      description: 'Quick delivery right to your doorstep',
    },
    {
      icon: Shield,
      title: '24/7 Support',
      description: 'Round-the-clock customer support to help you',
    },
    {
      icon: Award,
      title: 'Best Prices',
      description: 'Competitive pricing guaranteed',
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-orange-100 p-3 rounded-full">
                  <feature.icon className="h-6 w-6 text-orange-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}