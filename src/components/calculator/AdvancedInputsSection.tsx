import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Lock, Unlock, ChevronDown, ChevronUp } from 'lucide-react';
import { EMACalculatorInputs } from '@/types/ema-calculator';

interface AdvancedInputsSectionProps {
  inputs: EMACalculatorInputs;
  onUpdateInput: (field: keyof EMACalculatorInputs, value: string | number) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AdvancedInputsSection: React.FC<AdvancedInputsSectionProps> = ({ 
  inputs, 
  onUpdateInput,
  isOpen,
  onOpenChange
}) => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  const handlePinSubmit = () => {
    if (pinInput === '0000') {
      setIsUnlocked(true);
      setPinError(false);
      setPinInput('');
    } else {
      setPinError(true);
      setTimeout(() => setPinError(false), 2000);
    }
  };

  const handleLock = () => {
    setIsUnlocked(false);
    setPinInput('');
  };

  return (
    <Card className="shadow-soft border-amber-200">
      <Collapsible open={isOpen} onOpenChange={onOpenChange}>
        <CollapsibleTrigger asChild>
          <CardHeader className="pb-4 cursor-pointer hover:bg-muted/50 transition-colors">
            <CardTitle className="flex items-center justify-between text-amber-600">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Advanced Inputs — Requires PIN
              </div>
              <Button variant="ghost" size="sm">
                {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="space-y-6">
            {!isUnlocked ? (
              <div className="space-y-4">
                <Alert>
                  <Lock className="h-4 w-4" />
                  <AlertDescription>
                    These advanced settings require a PIN to access. Enter PIN below.
                  </AlertDescription>
                </Alert>
                
                <div className="flex gap-2 max-w-xs">
                  <Input
                    type="password"
                    placeholder="Enter PIN"
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handlePinSubmit()}
                    className={pinError ? 'border-red-500' : ''}
                  />
                  <Button onClick={handlePinSubmit} variant="outline">
                    <Unlock className="h-4 w-4" />
                  </Button>
                </div>
                
                {pinError && (
                  <p className="text-sm text-red-500">Incorrect PIN. Please try again.</p>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b pb-4">
                  <Alert>
                    <Unlock className="h-4 w-4" />
                    <AlertDescription>
                      Advanced settings unlocked. Handle with care - these affect core calculations.
                    </AlertDescription>
                  </Alert>
                  <Button onClick={handleLock} variant="outline" size="sm">
                    <Lock className="h-4 w-4 mr-2" />
                    Lock
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Benefits + Management Multiplier - FIRST */}
                  <div className="space-y-2">
                    <Label htmlFor="benefitsMultiplier" className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Benefits + Management Multiplier (x)
                    </Label>
                    <Input
                      id="benefitsMultiplier"
                      type="number"
                      value={inputs.benefitsMultiplier}
                      onChange={(e) => onUpdateInput('benefitsMultiplier', parseFloat(e.target.value) || 0)}
                      step="0.1"
                      className="text-lg font-medium"
                    />
                    <p className="text-sm text-muted-foreground">
                      Multiplier applied to rep salary to account for benefits and management overhead — used to calculate all-in partner cost per rep.
                    </p>
                  </div>

                  {/* Overhead & Profit Multiplier - SECOND */}
                  <div className="space-y-2">
                    <Label htmlFor="partnerOverhead" className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Overhead & Profit Multiplier (x)
                    </Label>
                    <Input
                      id="partnerOverhead"
                      type="number"
                      value={inputs.partnerOverheadMultiplier}
                      onChange={(e) => onUpdateInput('partnerOverheadMultiplier', parseFloat(e.target.value) || 0)}
                      step="0.1"
                      className="text-lg font-medium"
                    />
                    <p className="text-sm text-muted-foreground">
                      Partner margin multiplier applied to cost per query to get final price to client.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Ema Price per Query */}
                  <div className="space-y-2">
                    <Label htmlFor="emaPrice" className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Ema Price per Query ($)
                    </Label>
                    <Input
                      id="emaPrice"
                      type="number"
                      value={inputs.emaPricePerQuery}
                      onChange={(e) => onUpdateInput('emaPricePerQuery', parseFloat(e.target.value) || 0)}
                      step="0.01"
                      className="text-lg font-medium"
                    />
                    <p className="text-sm text-muted-foreground">
                      Price charged by Ema for resolving each query.
                    </p>
                  </div>

                  {/* Partner Profit Margin */}
                  <div className="space-y-2">
                    <Label htmlFor="partnerMargin" className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Partner Profit Margin on Ema Queries (%)
                    </Label>
                    <Input
                      id="partnerMargin"
                      type="number"
                      value={inputs.partnerProfitMargin * 100}
                      onChange={(e) => onUpdateInput('partnerProfitMargin', (parseFloat(e.target.value) || 0) / 100)}
                      step="1"
                      className="text-lg font-medium"
                    />
                    <p className="text-sm text-muted-foreground">
                      Partner's profit margin percentage on Ema-handled interactions
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};