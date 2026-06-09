export interface AcademicDoc {
  id: string;
  title: string;
  abstract: string;
  category: 'IEEE' | 'Methodology' | 'arXiv' | 'Patent';
}

export const ACADEMIC_DATASET: AcademicDoc[] = [
  // IEEE Abstracts (Sample)
  {
    id: "ieee-1",
    title: "Deep Learning for Real-Time Object Detection in Autonomous Vehicles",
    abstract: "This paper presents a novel deep learning architecture optimized for real-time object detection in autonomous driving scenarios. By utilizing a pruned convolutional neural network, we achieve a 30% reduction in latency while maintaining 95% mAP on the KITTI dataset.",
    category: "IEEE"
  },
  {
    id: "ieee-2",
    title: "Blockchain-Based Secure Data Sharing in Healthcare IoT",
    abstract: "We propose a decentralized framework for secure medical data exchange using Hyperledger Fabric. The system ensures data integrity and patient privacy through smart contracts and zero-knowledge proofs, reducing unauthorized access attempts by 85%.",
    category: "IEEE"
  },
  {
    id: "ieee-3",
    title: "Energy-Efficient Resource Allocation in 6G Networks",
    abstract: "This research investigates the use of Deep Reinforcement Learning (DRL) for dynamic resource allocation in future 6G networks. Results show a 40% improvement in energy efficiency compared to traditional heuristic methods in high-density urban environments.",
    category: "IEEE"
  },
  // arXiv Pre-prints (Sample)
  {
    id: "arxiv-1",
    title: "Large Language Models as Zero-Shot Clinical Reasoners",
    abstract: "We investigate the zero-shot capabilities of large language models (LLMs) in clinical reasoning tasks. Our findings suggest that with appropriate prompting, LLMs can match the performance of specialized medical models on several diagnostic benchmarks.",
    category: "arXiv"
  },
  {
    id: "arxiv-2",
    title: "On the Robustness of Vision Transformers to Common Corruptions",
    abstract: "This pre-print analyzes the robustness of Vision Transformers (ViT) compared to traditional CNNs. We demonstrate that ViTs exhibit superior performance under spatial corruptions and adversarial perturbations due to their global receptive fields.",
    category: "arXiv"
  },
  // Patents (Sample)
  {
    id: "patent-1",
    title: "US Patent 11,234,567: Adaptive Noise Cancellation for Wearable Devices",
    abstract: "A method and apparatus for adaptive noise cancellation in wearable audio devices. The system utilizes multiple microphones and a neural network to dynamically adjust filter coefficients based on ambient noise profiles.",
    category: "Patent"
  },
  {
    id: "patent-2",
    title: "US Patent 10,987,654: Distributed Ledger for Supply Chain Transparency",
    abstract: "A system for tracking goods through a supply chain using a distributed ledger. Each transaction is cryptographically signed and recorded, providing an immutable audit trail for provenance verification.",
    category: "Patent"
  },
  // Research Methodology (Sample)
  {
    id: "meth-1",
    title: "Qualitative vs. Quantitative Research Designs",
    abstract: "Qualitative research focuses on understanding human behavior from the informant's perspective, typically using interviews and observations. Quantitative research emphasizes objective measurements and statistical analysis of data collected through polls or surveys.",
    category: "Methodology"
  }
];

// Expanded dataset simulation
export function getFullDataset(): AcademicDoc[] {
  const full: AcademicDoc[] = [...ACADEMIC_DATASET];
  
  const topics = [
    "Quantum Computing", "Cybersecurity", "Artificial Intelligence", "Cloud Computing", 
    "Software Engineering", "Human-Computer Interaction", "Data Science", "Robotics",
    "Natural Language Processing", "Computer Vision", "Internet of Things", "Wireless Communication",
    "Bioinformatics", "Renewable Energy", "Smart Grids", "Nanotechnology"
  ];
  
  const methodologyTopics = [
    "Case Study Design", "Experimental Research", "Grounded Theory", "Ethnography",
    "Action Research", "Survey Methodology", "Statistical Significance", "Validity and Reliability",
    "Mixed Methods", "Phenomenology", "Content Analysis", "Longitudinal Studies"
  ];

  // Generate IEEE (200 total)
  for (let i = 0; i < 197; i++) {
    const topic = topics[i % topics.length];
    full.push({
      id: `ieee-gen-${i}`,
      title: `${topic} Optimization in ${i % 2 === 0 ? 'Distributed' : 'Centralized'} Systems`,
      abstract: `This study explores the application of ${topic} to enhance system performance. We propose a framework that leverages ${topic} principles to achieve higher throughput and lower latency. Experimental results indicate a significant improvement over baseline models in various ${topic}-related benchmarks.`,
      category: "IEEE"
    });
  }

  // Generate arXiv (100 total)
  for (let i = 0; i < 98; i++) {
    const topic = topics[i % topics.length];
    full.push({
      id: `arxiv-gen-${i}`,
      title: `Emerging Trends in ${topic}: A Comprehensive Survey`,
      abstract: `In this pre-print, we survey the latest developments in ${topic}. We categorize existing literature into three main sub-fields and identify key open challenges for future research. Our analysis highlights the growing importance of ${topic} in multi-disciplinary applications.`,
      category: "arXiv"
    });
  }

  // Generate Patents (50 total)
  for (let i = 0; i < 48; i++) {
    const topic = topics[i % topics.length];
    full.push({
      id: `patent-gen-${i}`,
      title: `US Patent ${12000000 + i}: System for ${topic} Management`,
      abstract: `The present invention relates to a system and method for managing ${topic} processes. The system includes a processor configured to execute instructions for optimizing ${topic} parameters, resulting in improved efficiency and reduced resource consumption.`,
      category: "Patent"
    });
  }

  // Generate Methodology (50 total)
  for (let i = 0; i < 49; i++) {
    const topic = methodologyTopics[i % methodologyTopics.length];
    full.push({
      id: `meth-gen-${i}`,
      title: `Advanced ${topic} in Modern Research`,
      abstract: `This document details the principles of ${topic} as applied to contemporary research challenges. It discusses the strengths and limitations of ${topic}, providing a guide for researchers to implement this methodology effectively in their own studies.`,
      category: "Methodology"
    });
  }

  return full;
}
