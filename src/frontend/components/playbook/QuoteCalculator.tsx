import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { vehicleRates, zones, attractions, comboPackages } from '@/data/playbook-data';
import { Calculator, Car, MapPin, Ticket, Package, Copy, Check, Users, Minus, Plus, RefreshCcw } from 'lucide-react';
import { toast } from 'sonner';

export function QuoteCalculator() {
  const [vehicle, setVehicle] = useState<string>('');
  const [zone, setZone] = useState<string>('');
  const [tourType, setTourType] = useState<'full-dubai' | 'full-abudhabi' | 'half-dubai' | 'transfer'>('full-dubai');
  const [guests, setGuests] = useState<number | ''>(1);
  const [selectedAttractions, setSelectedAttractions] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const selectedVehicle = vehicleRates.find(v => v.vehicle === vehicle);
  const selectedZone = zones.find(z => z.zone.toString() === zone);

  // Derived value for calculations (fallback to 1 if empty)
  const safeGuests = typeof guests === 'number' && guests > 0 ? guests : 1;

  // --- Handlers ---

  const handleGuestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '') {
      setGuests('');
      return;
    }
    const parsed = parseInt(val, 10);
    if (!isNaN(parsed)) setGuests(parsed);
  };

  const handleGuestBlur = () => {
    let val = typeof guests === 'number' ? guests : 1;
    if (val < 1) val = 1;
    if (val > 500) val = 500;
    setGuests(val);
  };

  const incrementGuests = () => setGuests(Math.min(500, (typeof guests === 'number' ? guests : 0) + 1));
  const decrementGuests = () => setGuests(Math.max(1, (typeof guests === 'number' ? guests : 1) - 1));

  const resetForm = () => {
    setVehicle('');
    setZone('');
    setTourType('full-dubai');
    setGuests(1);
    setSelectedAttractions([]);
    toast.info('Calculator reset');
  };

  // --- Calculations ---

  const calculation = useMemo(() => {
    if (!selectedVehicle || !selectedZone) return null;

    // Determine Rate Key based on capacity
    const rateKey =
      selectedVehicle.capacity <= 4 ? 'seater4' :
      selectedVehicle.capacity <= 7 ? 'seater7' :
      selectedVehicle.capacity <= 12 ? 'seater12' :
      selectedVehicle.capacity <= 22 ? 'seater22' :
      selectedVehicle.capacity <= 35 ? 'seater35' : 'seater50';
    
    // Zone Rate (This is the transfer/pickup cost)
    const pickupRate = selectedZone.rates[rateKey] ?? selectedZone.rates.seater7 ?? 0;

    // Vehicle Rate (Base rental cost)
    let vehicleRate = 0;
    if (tourType === 'full-dubai') vehicleRate = selectedVehicle.fullDayDubai;
    else if (tourType === 'full-abudhabi') vehicleRate = selectedVehicle.fullDayAbuDhabi;
    else if (tourType === 'half-dubai') vehicleRate = selectedVehicle.halfDayDubai;
    else if (tourType === 'transfer') vehicleRate = 0; // Transfer is just the zone rate

    // Attractions
    const attractionsCost = selectedAttractions.reduce((sum, id) => {
      const attr = attractions.find(a => a.id === id);
      return sum + (attr ? attr.sellPrice * safeGuests : 0);
    }, 0);

    const subtotal = vehicleRate + pickupRate + attractionsCost;
    
    return {
      vehicleRate,
      pickupRate, // For transfers, this is the main cost
      attractionsCost,
      total: subtotal,
      perPerson: Math.ceil(subtotal / safeGuests),
    };
  }, [selectedVehicle, selectedZone, tourType, selectedAttractions, safeGuests]);

  const copyQuote = () => {
    if (!calculation) return;

    let tourLabel = 'Full Day Dubai';
    if (tourType === 'full-abudhabi') tourLabel = 'Full Day Abu Dhabi';
    if (tourType === 'half-dubai') tourLabel = 'Half Day Dubai';
    if (tourType === 'transfer') tourLabel = 'One-Way Transfer (Drop-off)';

    const quote = `
🌟 Ahmed Travel Quote
━━━━━━━━━━━━━━━━━━

📍 Service: ${tourLabel}
🚐 Vehicle: ${vehicle}
📍 Zone: Zone ${zone} (${selectedZone?.name})
👥 Guests: ${safeGuests}

💰 Breakdown:
${tourType !== 'transfer' ? `• Vehicle Rental: AED ${calculation.vehicleRate}\n` : ''}• Transfer/Logistics: AED ${calculation.pickupRate}
${calculation.attractionsCost > 0 ? `• Attractions: AED ${calculation.attractionsCost}` : ''}

━━━━━━━━━━━━━━━━━━
✨ Total: AED ${calculation.total}
👤 Per Person: AED ${calculation.perPerson}

Thank you for choosing Ahmed Travel! ✈️
    `.trim();

    navigator.clipboard.writeText(quote);
    setCopied(true);
    toast.success('Quote copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Calculator Form */}
      <Card variant="elevated">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-primary" />
              Smart Quote Builder
            </CardTitle>
            <CardDescription>
              Instant quotes for Tours & Transfers
            </CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={resetForm} title="Reset Form">
            <RefreshCcw className="h-4 w-4 text-muted-foreground hover:text-primary" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Tour Type */}
          <div className="space-y-2">
            <Label>Service Type</Label>
            <Select
              value={tourType}
              onValueChange={(v: 'full-dubai' | 'full-abudhabi' | 'half-dubai' | 'transfer') => setTourType(v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select service type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full-dubai">Full Day Dubai Tour</SelectItem>
                <SelectItem value="full-abudhabi">Full Day Abu Dhabi Tour</SelectItem>
                <SelectItem value="half-dubai">Half Day Dubai Tour</SelectItem>
                <SelectItem value="transfer">Airport Transfer / One-Way</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Vehicle Selection */}
          <div className="space-y-2">
            <Label className="flex items-center gap-1.5">
              <Car className="h-4 w-4" />
              Vehicle Type
            </Label>
            <Select value={vehicle} onValueChange={setVehicle}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select vehicle" />
              </SelectTrigger>
              <SelectContent>
                {vehicleRates.map(v => (
                  <SelectItem key={v.vehicle} value={v.vehicle}>
                    {v.vehicle} (up to {v.capacity} guests)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Zone Selection */}
          <div className="space-y-2">
            <Label className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              {tourType === 'transfer' ? 'Pickup/Drop-off Zone' : 'Pickup Zone'}
            </Label>
            <Select value={zone} onValueChange={setZone}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select zone" />
              </SelectTrigger>
              <SelectContent>
                {zones.map(z => (
                  <SelectItem key={z.zone} value={z.zone.toString()}>
                    <span className="font-medium">Zone {z.zone}</span> - <span className="text-muted-foreground">{z.name}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Guests Input */}
          <div className="space-y-2">
            <Label className="flex items-center gap-1.5">
              <Users className="h-4 w-4" />
              Number of Guests
            </Label>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={decrementGuests} className="h-10 w-10 shrink-0">
                <Minus className="h-4 w-4" />
              </Button>
              <Input
                type="number"
                min={1}
                max={500}
                value={guests}
                onChange={handleGuestChange}
                onBlur={handleGuestBlur}
                className="text-center font-medium"
              />
              <Button variant="outline" size="icon" onClick={incrementGuests} className="h-10 w-10 shrink-0">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Attractions Add-on */}
          <div className="space-y-2">
            <Label className="flex items-center gap-1.5">
              <Ticket className="h-4 w-4" />
              Add-on Attractions (per guest)
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {attractions.slice(0, 6).map(attr => (
                <Button
                  key={attr.id}
                  variant={selectedAttractions.includes(attr.id) ? 'gold' : 'outline'}
                  size="sm"
                  className="justify-start text-xs h-auto py-2 transition-all duration-200"
                  onClick={() => {
                    setSelectedAttractions(prev =>
                      prev.includes(attr.id) ? prev.filter(id => id !== attr.id) : [...prev, attr.id]
                    );
                  }}
                >
                  <span className="truncate text-left">{attr.name}</span>
                  <Badge variant="muted" className="ml-auto text-[10px] shrink-0">
                    {attr.sellPrice}
                  </Badge>
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quote Preview */}
      <div className="space-y-4">
        <Card variant="navy" className="border-amber-500/30 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-white">Quote Preview</CardTitle>
          </CardHeader>
          <CardContent>
            {calculation ? (
              <div className="space-y-4">
                <div className="space-y-2 text-sm text-gray-300">
                  {tourType !== 'transfer' && (
                    <div className="flex justify-between">
                      <span>Vehicle Rental</span>
                      <span>AED {calculation.vehicleRate}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>{tourType === 'transfer' ? 'Transfer Cost' : 'Logistics Surcharge'} (Zone {zone})</span>
                    <span>AED {calculation.pickupRate}</span>
                  </div>
                  {calculation.attractionsCost > 0 && (
                    <div className="flex justify-between text-amber-400/80">
                      <span>Attractions ({safeGuests}x)</span>
                      <span>AED {calculation.attractionsCost}</span>
                    </div>
                  )}
                </div>
                
                <div className="border-t border-white/10 pt-4">
                  <div className="flex justify-between text-xl font-bold text-white">
                    <span>Total</span>
                    <span className="text-amber-500 font-mono">AED {calculation.total}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>Per Person ({safeGuests} guests)</span>
                    <span>AED {calculation.perPerson}</span>
                  </div>
                </div>

                <Button 
                  className="w-full mt-4 bg-amber-500 hover:bg-amber-600 text-black font-bold"
                  onClick={copyQuote}
                >
                  {copied ? (
                    <><Check className="h-4 w-4 mr-2" /> Copied!</>
                  ) : (
                    <><Copy className="h-4 w-4 mr-2" /> Copy Quote to WhatsApp</>
                  )}
                </Button>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500 border-2 border-dashed border-white/10 rounded-xl">
                <Car className="h-10 w-10 mx-auto mb-3 opacity-20" />
                <p>Select a vehicle and zone to generate a quote.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Combos */}
        <Card variant="elevated">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Package className="h-4 w-4 text-primary" />
              Quick Combos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {comboPackages.slice(0, 3).map(combo => (
                <div 
                  key={combo.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors border border-transparent hover:border-primary/10 cursor-pointer"
                  onClick={() => {
                    toast.success(`Copied ${combo.name} details!`);
                    navigator.clipboard.writeText(`Package: ${combo.name}\nIncludes: ${combo.items.join(', ')}\nPrice: AED ${combo.totalPrice}`);
                  }}
                >
                  <div className="overflow-hidden">
                    <p className="font-medium text-sm truncate">{combo.name}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{combo.items.join(' + ')}</p>
                  </div>
                  <div className="text-right shrink-0 ml-2">
                    <p className="font-bold text-primary text-sm">AED {combo.totalPrice}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}