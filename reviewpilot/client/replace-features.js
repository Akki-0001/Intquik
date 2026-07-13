const fs = require('fs');

const path = 'c:/Users/ay946/OneDrive/Desktop/ReviewPilot/reviewpilot/client/app/page.tsx';
let content = fs.readFileSync(path, 'utf8');

const startIndex = content.indexOf('{/* AI Telecalling Agent — Voice AI */}');
const endIndex = content.indexOf('{/* How it Works */}');

if (startIndex !== -1 && endIndex !== -1) {
  const replacement = `      {/* Features Summary Section */}
      <section id="features" className="bg-[#EAF4FC] text-[#14142B] py-24 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <span className="eyebrow mb-4 inline-block">Powerful Capabilities</span>
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-[#14142B] mb-6">
            Scale Your Business <span className="text-[#2361F5]">Automatically</span>
          </h2>
          <p className="text-[#5F6473] max-w-2xl mx-auto mb-16 text-lg">
            Our suite of AI-driven tools helps you capture leads, engage customers 24/7, and skyrocket your online reputation effortlessly.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 text-left">
            <div className="trust-card">
              <QrCode className="w-10 h-10 text-[#2361F5] mb-6" />
              <h3 className="text-xl font-heading font-bold mb-3">Smart AI-Review QR Kit</h3>
              <p className="text-[#5F6473] mb-6">Generate personalized Google review QR codes and auto-reply to reviews using AI to boost local SEO.</p>
              <ul className="space-y-2 mb-0">
                <li className="flex items-center gap-2 text-sm text-[#5F6473] font-semibold"><Check className="w-4 h-4 text-[#FF5A3C]" /> Custom Branded Link</li>
                <li className="flex items-center gap-2 text-sm text-[#5F6473] font-semibold"><Check className="w-4 h-4 text-[#FF5A3C]" /> AI SEO Prompts</li>
                <li className="flex items-center gap-2 text-sm text-[#5F6473] font-semibold"><Check className="w-4 h-4 text-[#FF5A3C]" /> Auto-Replies</li>
              </ul>
            </div>
            <div className="trust-card">
              <Headphones className="w-10 h-10 text-[#2361F5] mb-6" />
              <h3 className="text-xl font-heading font-bold mb-3">AI Telecalling Agent</h3>
              <p className="text-[#5F6473] mb-6">A human-like voice AI that books appointments and follows up with leads in multiple languages.</p>
              <ul className="space-y-2 mb-0">
                <li className="flex items-center gap-2 text-sm text-[#5F6473] font-semibold"><Check className="w-4 h-4 text-[#FF5A3C]" /> Natural Voice Engine</li>
                <li className="flex items-center gap-2 text-sm text-[#5F6473] font-semibold"><Check className="w-4 h-4 text-[#FF5A3C]" /> Auto-Scheduling</li>
                <li className="flex items-center gap-2 text-sm text-[#5F6473] font-semibold"><Check className="w-4 h-4 text-[#FF5A3C]" /> CRM Integration</li>
              </ul>
            </div>
            <div className="trust-card">
              <MessageCircle className="w-10 h-10 text-[#2361F5] mb-6" />
              <h3 className="text-xl font-heading font-bold mb-3">WhatsApp Chatbot</h3>
              <p className="text-[#5F6473] mb-6">Automate product discovery and lead qualification 24x7 with interactive WhatsApp bots.</p>
              <ul className="space-y-2 mb-0">
                <li className="flex items-center gap-2 text-sm text-[#5F6473] font-semibold"><Check className="w-4 h-4 text-[#FF5A3C]" /> 24/7 Auto Replies</li>
                <li className="flex items-center gap-2 text-sm text-[#5F6473] font-semibold"><Check className="w-4 h-4 text-[#FF5A3C]" /> Smart Lead Qualify</li>
                <li className="flex items-center gap-2 text-sm text-[#5F6473] font-semibold"><Check className="w-4 h-4 text-[#FF5A3C]" /> Payments & Flows</li>
              </ul>
            </div>
          </div>

          <Link href="/features" className="btn-primary inline-flex">
            See All Detailed Features <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </section>

      `;
  
  const newContent = content.substring(0, startIndex) + replacement + content.substring(endIndex);
  fs.writeFileSync(path, newContent, 'utf8');
  console.log("Successfully replaced the features section.");
} else {
  console.log("Could not find start or end index.");
}
