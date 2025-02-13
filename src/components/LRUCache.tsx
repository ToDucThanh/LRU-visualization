import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft } from 'lucide-react';

const CacheBlock = ({ letter, number, highlight, isNew, isEvicted }) => (
  <div className={`
    inline-flex items-center justify-center
    w-20 h-20 border-2 relative
    ${highlight ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
    ${isNew ? 'animate-pulse border-green-500' : ''}
    ${isEvicted ? 'border-red-500' : ''}
    text-xl font-bold
    mx-1
  `}>
    {letter}({number})
    {isNew && (
      <div className="absolute -top-6 text-xs text-green-600 font-normal">
        New Entry
      </div>
    )}
    {isEvicted && (
      <div className="absolute -top-6 text-xs text-red-600 font-normal">
        Evicted
      </div>
    )}
  </div>
);

const Arrow = ({ type, isEviction }) => {
  const commonPath = isEviction 
    ? "M 20 0 C 20 20, 60 20, 80 40" 
    : "M 40 0 L 40 40";

  return (
    <div className="h-12 w-full flex justify-center items-center">
      <svg className="w-32 h-12" viewBox="0 0 80 40">
        <path
          d={commonPath}
          stroke="#4B5563"
          strokeWidth="3"
          fill="none"
          markerEnd="url(#arrowhead)"
        />
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#4B5563" />
          </marker>
        </defs>
      </svg>
    </div>
  );
};

const CacheRow = ({ blocks, highlight, previousBlocks, isEviction, stepNumber, description }) => (
  <div className="flex flex-col items-center mb-8">
    <div className="w-full text-left mb-2 font-medium text-gray-700">
      Step {stepNumber}: {description}
    </div>
    <div className="flex items-center mb-2 bg-white p-4 rounded-lg shadow-sm">
      {blocks.map((block, index) => (
        <div key={index}>
          {block ? (
            <CacheBlock
              letter={block.letter}
              number={block.number}
              highlight={highlight === `${block.letter}${block.number}`}
              isNew={!previousBlocks?.find(b => b?.letter === block.letter && b?.number === block.number)}
              isEvicted={previousBlocks?.find(b => b?.letter === block.letter && b?.number === block.number) && 
                        !blocks.find(b => b?.letter === block.letter && b?.number === block.number)}
            />
          ) : (
            <div className="w-20 h-20 border-2 border-gray-300 border-dashed mx-1" />
          )}
        </div>
      ))}
    </div>
    <Arrow isEviction={isEviction} />
  </div>
);

const LRUCacheVisualizer = () => {
  const capacity = 4;
  const [currentStep, setCurrentStep] = useState(0);
  const [highlight, setHighlight] = useState(null);

  // Define all steps explicitly
  const allSteps = [
    {
      blocks: [{ letter: 'A', number: 0 }, null, null, null],
      description: "Initial state: Added A(0) to empty cache",
      isEviction: false
    },
    {
      blocks: [{ letter: 'A', number: 0 }, { letter: 'B', number: 1 }, null, null],
      description: "Added B(1) to available slot",
      isEviction: false
    },
    {
      blocks: [{ letter: 'A', number: 0 }, { letter: 'B', number: 1 }, 
              { letter: 'C', number: 2 }, null],
      description: "Added C(2) to available slot",
      isEviction: false
    },
    {
      blocks: [{ letter: 'A', number: 0 }, { letter: 'B', number: 1 }, 
              { letter: 'C', number: 2 }, { letter: 'D', number: 3 }],
      description: "Added D(3) to last available slot",
      isEviction: false
    },
    {
      blocks: [{ letter: 'E', number: 4 }, { letter: 'B', number: 1 }, 
              { letter: 'C', number: 2 }, { letter: 'D', number: 3 }],
      description: "Cache full: E(4) replaces oldest entry A(0)",
      isEviction: true
    }
  ];

  const [steps, setSteps] = useState([allSteps[0]]);

  const executeOperation = () => {
    if (currentStep >= allSteps.length - 1) return;
    
    const nextStep = currentStep + 1;
    const newStep = allSteps[nextStep];
    
    setSteps([...steps, newStep]);
    setCurrentStep(nextStep);
    
    const newBlock = newStep.blocks.find(block => 
      !steps[steps.length - 1].blocks.some(b => b?.letter === block?.letter)
    );
    if (newBlock) {
      setHighlight(`${newBlock.letter}${newBlock.number}`);
      setTimeout(() => setHighlight(null), 1000);
    }
  };

  const reset = () => {
    setSteps([allSteps[0]]);
    setCurrentStep(0);
    setHighlight(null);
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader className="border-b">
        <CardTitle className="text-2xl">LRU Cache Step-by-Step Visualization</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="flex items-center space-x-4 mb-8">
            <Button 
              onClick={executeOperation}
              disabled={currentStep >= allSteps.length - 1}
              className="bg-blue-500 hover:bg-blue-600"
            >
              Next Step
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button 
              onClick={reset}
              variant="outline"
              className="border-gray-300"
            >
              Reset
              <ArrowLeft className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mb-4 shadow-sm">
            <h3 className="font-medium mb-2 text-gray-700">Current Progress:</h3>
            <div className="text-sm space-y-2">
              <p><span className="font-medium">Step:</span> {currentStep + 1} of {allSteps.length}</p>
              <p><span className="font-medium">Cache Capacity:</span> {capacity}</p>
              <p><span className="font-medium">Used Slots:</span> {steps[steps.length - 1].blocks.filter(Boolean).length}</p>
              <p><span className="font-medium">Available Slots:</span> {capacity - steps[steps.length - 1].blocks.filter(Boolean).length}</p>
            </div>
          </div>

          <div className="flex flex-col items-center bg-gray-50 p-6 rounded-lg">
            {steps.map((step, index) => (
              <CacheRow 
                key={index}
                blocks={step.blocks}
                highlight={highlight}
                previousBlocks={index > 0 ? steps[index - 1].blocks : null}
                isEviction={step.isEviction}
                stepNumber={index + 1}
                description={step.description}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LRUCacheVisualizer;