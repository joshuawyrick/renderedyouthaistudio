import React from 'react';
import TopNav from '@/components/navigation/TopNav';
import Footer from '@/components/layout/Footer';
import { RYCard } from '@/components/ui/ry-card';

const About = () => {
  const family = [
    {
      name: "Tucker Wyrick",
      role: "Co-Founder & Kid Community Liaison",
      bio: "The inspiration behind Rendered Youth! Tucker's entrepreneurial spirit and desire to start his own business sparked the conversation that led to Tucker's Tees and eventually Rendered Youth.",
      avatar: "👦"
    },
    {
      name: "Joshua Wyrick",
      role: "Co-Founder & Serial Entrepreneur",
      bio: "Tucker's father and serial entrepreneur whose mission is to inspire children to be entrepreneurs, teach them along the way, and allow them to earn money from a young age so they can pay for college or pursue any future endeavor.",
      avatar: "👨"
    },
    {
      name: "Vanessa Wyrick",
      role: "Mom Extraordinaire & Family Rock",
      bio: "The heart of our family who loves people and finds passion in lifting up others. She's our rock and without her support, nothing would be possible.",
      avatar: "👩"
    }
  ];

  const stats = [
    { label: "Young Entrepreneurs", value: "Growing!" },
    { label: "Designs Created", value: "Every Day" },
    { label: "Dreams Supported", value: "Countless" },
    { label: "Community Strong", value: "Always" }
  ];

  return (
    <div className="min-h-screen bg-ry-white">
      <TopNav />
      
      {/* Add top padding to account for fixed navbar */}
      <div className="pt-40">
        {/* Hero Section */}
        <section className="bg-ry-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-ry-black mb-8">
                From Tucker's Dream
                <span className="block text-ry-yellow mt-2">To Rendered Youth</span>
              </h1>
              <p className="text-xl text-gray-600 mb-12">
                What started as one kid's desire to start a business has grown into a platform 
                where all children can learn entrepreneurship, create amazing art, and earn money 
                doing what they love. This is our family's story.
              </p>
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="bg-gray-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-ry-black mb-6">
                  Our Story
                </h2>
                <div className="space-y-4 text-lg text-gray-600">
                  <p>
                    It all started when Tucker expressed his desire to start a business. That simple conversation 
                    between a curious kid and his entrepreneurial father sparked something bigger than we ever imagined.
                  </p>
                  <p>
                    Josh has always believed that his path was entrepreneurship, and he wished he had started 
                    learning at a younger age. When Tucker showed interest, it became clear that this was an 
                    opportunity not just for Tucker to learn and earn, but for ALL kids to do the same.
                  </p>
                  <p>
                    What began as "Tucker's Tees" evolved into Rendered Youth - a platform where children can 
                    turn their creativity into real income while learning valuable entrepreneurial skills along the way.
                  </p>
                </div>
              </div>
              <div className="bg-ry-white rounded-2xl p-8 text-center">
                <div className="text-6xl mb-4">✨</div>
                <h3 className="text-xl font-semibold text-ry-black mb-2">
                  Our Mission
                </h3>
                <p className="text-gray-600">
                  To inspire children to become entrepreneurs, teach them along the way, and allow them 
                  to earn money from an early age (with parental supervision of course).
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Meet Our Family Section */}
        <section className="bg-ry-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-ry-black text-center mb-12">
              Meet Our Family
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {family.map((member, index) => (
                <RYCard key={index} className="text-center">
                  <div className="text-6xl mb-4">{member.avatar}</div>
                  <h3 className="text-xl font-semibold text-ry-black mb-2">
                    {member.name}
                  </h3>
                  <p className="text-ry-yellow font-medium mb-4">
                    {member.role}
                  </p>
                  <p className="text-gray-600">
                    {member.bio}
                  </p>
                </RYCard>
              ))}
            </div>
          </div>
        </section>

        {/* Tucker's Tees Legacy Section */}
        <section className="bg-gray-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-ry-black mb-6">
                The Tucker's Tees Legacy
              </h2>
              <p className="text-xl text-gray-600">
                Where it all started - Tucker's original designs that launched our journey
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-4 text-lg text-gray-600">
                <p>
                  Tucker's Tees began as a simple idea: what if kids could see their artwork come to life 
                  on real products? Tucker's enthusiasm for creating and sharing his designs showed us 
                  the incredible potential that exists when you give children the tools to express themselves.
                </p>
                <p>
                  His designs aren't just art - they're conversations starters, confidence builders, 
                  and proof that age is just a number when it comes to creativity and entrepreneurship.
                </p>
                <p>
                  Today, Tucker's original collection continues to inspire other young creators to share 
                  their own unique perspectives with the world.
                </p>
              </div>
              <div className="bg-ry-white rounded-2xl p-8">
                <div className="text-center">
                  <div className="text-4xl mb-4">👕</div>
                  <h3 className="text-xl font-semibold text-ry-black mb-4">Shop Tucker's Collection</h3>
                  <a 
                    href="/store?collection=tuckers-tees" 
                    className="inline-block bg-ry-yellow text-ry-black px-6 py-3 rounded-lg font-medium hover:bg-yellow-600 transition-colors"
                  >
                    View Tucker's Designs
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Community Impact Section */}
        <section className="bg-ry-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-ry-black text-center mb-12">
              Building Community Together
            </h2>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-ry-yellow mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-600 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            <div className="max-w-4xl mx-auto text-center">
              <p className="text-lg text-gray-600 mb-8">
                We want to bring joy and inspiration to all who create with us. Our goal is to build 
                a community that not only earns but gives back. We'll organize fundraisers donating 
                profits to causes important to our families, and we'll support schools and organizations 
                that want to participate in teaching entrepreneurship to kids.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-ry-black py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-ry-white mb-8">
              Join Our Family's Mission
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Whether you're a young artist ready to start your entrepreneurial journey, or a family 
              that believes in supporting creativity, we'd love to have you be part of our story.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/age-verification" className="bg-ry-yellow text-ry-black px-8 py-3 rounded-lg font-medium hover:bg-yellow-600 transition-colors">
                Start Creating
              </a>
              <a href="/creators" className="border-2 border-ry-yellow text-ry-yellow px-8 py-3 rounded-lg font-medium hover:bg-ry-yellow hover:text-ry-black transition-colors">
                Meet Our Creators
              </a>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default About;
