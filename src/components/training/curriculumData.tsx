
import { Lightbulb, Building, Palette, Megaphone, BarChart, Settings } from 'lucide-react';

export const curriculumLevelsData = [
  {
    id: "level1",
    level: "Level 1: Idea Explorer",
    icon: <Lightbulb className="h-8 w-8 text-ry-yellow" />,
    profitShare: "Base Rate",
    description: "Discover your spark and learn to identify opportunities.",
    modules: [
      {
        title: "1.1 Discover Your Spark",
        subModules: [
          "Identifying your passions & strengths",
          "Turning hobbies into product ideas",
          "Setting your first mini-goals"
        ]
      },
      {
        title: "1.2 Creative Thinking Tools",
        subModules: [
          "Brainstorming & mind-mapping",
          "SCAMPER (Substitute, Combine…)",
          "Idea journaling & sketching"
        ]
      },
      {
        title: "1.3 Know Your Customer",
        subModules: [
          "Who's going to buy? (age, interests)",
          "Empathy mapping (their wants & pain points)",
          "Simple \"friends & family\" surveys"
        ]
      },
      {
        title: "1.4 Test Your Concept",
        subModules: [
          "Making a quick paper or digital mock-up",
          "Getting feedback and iterating",
          "Deciding \"go/no-go\" on your idea"
        ]
      }
    ]
  },
  {
    id: "level2",
    level: "Level 2: Business Fundamentals",
    icon: <Building className="h-8 w-8 text-ry-yellow" />,
    profitShare: "Increased Share",
    description: "Learn the core concepts of what makes a business work.",
    modules: [
      {
        title: "2.1 What Is a Business?",
        subModules: [
          "Definitions: entrepreneur, profit, risk",
          "Traits of successful kid CEOs",
          "Growth-mindset basics"
        ]
      },
      {
        title: "2.2 Business Models & Plans",
        subModules: [
          "Product vs. service vs. hybrid models",
          "Your first one-page business plan",
          "SMART goals (Specific, Measurable…)"
        ]
      },
      {
        title: "2.3 Legal Setup & Structure",
        subModules: [
          "Sole proprietorship vs. LLC explained",
          "How to register your business name",
          "Intro to permits, EINs and basic compliance"
        ]
      },
      {
        title: "2.4 Money Management & Budgeting",
        subModules: [
          "Opening a kid-friendly business bank account",
          "Income vs. expenses: the simple ledger",
          "Planning a basic budget & break-even point"
        ]
      }
    ]
  },
  {
    id: "level3",
    level: "Level 3: Design & Product Development",
    icon: <Palette className="h-8 w-8 text-ry-yellow" />,
    profitShare: "Higher Share",
    description: "Create amazing products that customers will love.",
    modules: [
      {
        title: "3.1 Fundamentals of Graphic Design",
        subModules: [
          "Basic design principles (color, balance)",
          "Free tools: Canva, simplified Adobe apps",
          "Creating your first shirt mock-up"
        ]
      },
      {
        title: "3.2 Sourcing & Production",
        subModules: [
          "Print-on-demand vs. small-batch printing",
          "Comparing cost, quality & turnaround",
          "Ordering and reviewing samples"
        ]
      },
      {
        title: "3.3 Pricing & Profit Margins",
        subModules: [
          "Calculating cost of goods sold (COGS)",
          "Setting a profitable price point",
          "Intro to discounts, bundles & value offers"
        ]
      },
      {
        title: "3.4 Building Your Online Store",
        subModules: [
          "Platform choices (built-in marketplace vs. standalone)",
          "Writing clear product titles & descriptions",
          "Setting up shipping options & policies"
        ]
      }
    ]
  },
  {
    id: "level4",
    level: "Level 4: Branding & Marketing Basics",
    icon: <Megaphone className="h-8 w-8 text-ry-yellow" />,
    profitShare: "Premium Share",
    description: "Build your brand and attract customers through marketing.",
    modules: [
      {
        title: "4.1 Brand Identity",
        subModules: [
          "Choosing a memorable name & logo",
          "Crafting your brand \"voice\"",
          "Simple brand guidelines (colors, fonts)"
        ]
      },
      {
        title: "4.2 Content Creation",
        subModules: [
          "Basic product photography (phone + good light)",
          "Writing engaging product stories",
          "Intro to short-form video (TikTok/Reels)"
        ]
      },
      {
        title: "4.3 Social Media Starter",
        subModules: [
          "Which platforms fit your audience",
          "Planning your first 4-week content calendar",
          "Hashtags, captions & timing best practices"
        ]
      },
      {
        title: "4.4 Community Engagement",
        subModules: [
          "Inviting reviews & user-generated content",
          "Starting a Facebook/Discord \"fan club\"",
          "Partnering with classmates & local friends"
        ]
      }
    ]
  },
  {
    id: "level5",
    level: "Level 5: Sales Growth & Optimization",
    icon: <BarChart className="h-8 w-8 text-ry-yellow" />,
    profitShare: "Advanced Share",
    description: "Scale your business and optimize for maximum growth.",
    modules: [
      {
        title: "5.1 Data & Analytics 101",
        subModules: [
          "Tracking orders, revenue & refunds",
          "Simple metrics: conversion rate & avg. order value",
          "Using built-in dashboard reports"
        ]
      },
      {
        title: "5.2 Intro to Paid Ads",
        subModules: [
          "Basics of social media ads (budget, targeting)",
          "Designing your first ad creative",
          "Measuring ad performance"
        ]
      },
      {
        title: "5.3 Email Marketing Essentials",
        subModules: [
          "Building a subscriber list (pop-ups, signup freebies)",
          "Writing your first newsletter",
          "Setting up an automated \"welcome\" email"
        ]
      },
      {
        title: "5.4 Promotions & Partnerships",
        subModules: [
          "Planning discount codes & limited-time offers",
          "Running giveaways & contests",
          "Collaborating with other young creators"
        ]
      }
    ]
  },
  {
    id: "level6",
    level: "Level 6: Operations & Scaling",
    icon: <Settings className="h-8 w-8 text-ry-yellow" />,
    profitShare: "Maximum Share",
    description: "Master entrepreneurial operations and plan for the future.",
    modules: [
      {
        title: "6.1 Bookkeeping & Taxes",
        subModules: [
          "Recording all sales & costs every week",
          "Sales tax basics & filing online",
          "When and how to talk to an accountant"
        ]
      },
      {
        title: "6.2 Customer Service Excellence",
        subModules: [
          "Responding to questions & complaints",
          "Writing friendly return/refund policies",
          "Turning a \"problem\" into a happy fan"
        ]
      },
      {
        title: "6.3 Outsourcing & Team Building",
        subModules: [
          "When to ask for help (family, classmates)",
          "Finding safe, age-appropriate freelancers",
          "Simple task checklists & handoffs"
        ]
      },
      {
        title: "6.4 Vision & Long-Term Planning",
        subModules: [
          "Reinvesting profits for growth",
          "Setting 6- and 12-month milestones",
          "Dreaming up your next product line"
        ]
      }
    ]
  }
];
