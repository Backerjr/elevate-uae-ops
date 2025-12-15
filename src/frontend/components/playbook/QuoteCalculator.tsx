import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { vehicleRates, zones, attractions, comboPackages } from '@/data/playbook-data';
import { Calculator, Car, MapPin, Ticket, Package, Copy, Check, Users, Plus, Minus } from 'lucide-react';
import { toast } from 'sonner';

export function QuoteCalculator() {
  const [vehicle, setVehicle] = useState<string>('');
  const [zone, setZone] = useState<string>('');
  const [tourType, setTourType] = useState<'full-dubai' | 'full-abudhabi' | 'half-dubai'>('full-dubai');
  const [guests, setGuests] = useState<number | string>(1);
  const [selectedAttractions, setSelectedAttractions] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const selectedVehicle = vehicleRates.find(v => v.vehicle === vehicle);
  const selectedZone = zones.find(z => z.zone.toString() === zone);

  const calculation = useMemo(() => {
    if (!selectedVehicle || !selectedZone) return null;

    const guestCount = typeof guests === 'string' ? parseInt(guests) || 1 : guests;

    const rateKey =
      selectedVehicle.capacity <= 4
        ? 'seater4'
        : selectedVehicle.capacity <= 7
          ? 'seater7'
          : selectedVehicle.capacity <= 12
            ? 'seater12'
            : selectedVehicle.capacity <= 22
              ? 'seater22'
              : selectedVehicle.capacity <= 35
                ? 'seater35'
                : 'seater50';
    const pickupRate = selectedZone.rates[rateKey] ?? selectedZone.rates.seater7 ?? 0;

    const vehicleRate = tourType === 'full-dubai' 
      ? selectedVehicle.fullDayDubai 
      : tourType === 'full-abudhabi'
        ? selectedVehicle.fullDayAbuDhabi
        : selectedVehicle.halfDayDubai;

    const attractionsCost = selectedAttractions.reduce((sum, id) => {
      const attr = attractions.find(a => a.id === id);
      return sum + (attr ? attr.sellPrice * guestCount : 0);
    }, 0);

    const subtotal = vehicleRate + pickupRate + attractionsCost;
    const total = subtotal;
    const perPerson = Math.ceil(total / guestCount);

    return {
      vehicleRate,
      pickupRate,
      attractionsCost,
      subtotal,
      total,
      perPerson,
    };
  }, [selectedVehicle, selectedZone, tourType, selectedAttractions, guests]);

  const copyQuote = () => {
    if (!calculation) return;

    const quote = `
🌟 Ahmed Travel Quote
━━━━━━━━━━━━━━━━━━

📍 Tour: ${tourType === 'full-dubai' ? 'Full Day Dubai' : tourType === 'full-abudhabi' ? 'Full Day Abu Dhabi' : 'Half Day Dubai'}
🚐 Vehicle: ${vehicle}
📍 Pickup Zone: Zone ${zone} (${selectedZone?.name})
👥 Guests: ${guests}

💰 Breakdown:
• Vehicle: AED ${calculation.vehicleRate}
• Pickup: AED ${calculation.pickupRate}
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

  const handleGuestChange = (value: string) => {
    if (value === '') {
      setGuests('');
      return;
    }
    const num = parseInt(value);
    if (!isNaN(num) && num >= 0) {
      setGuests(num);
    }
  };

  const handleGuestBlur = () => {
    let num = typeof guests === 'string' ? parseInt(guests) : guests;
    if (isNaN(num) || num < 1) num = 1;
    if (num > 500) num = 500;
    setGuests(num);
  };

  const incrementGuests = () => {
    const current = typeof guests === 'string' ? parseInt(guests) || 0 : guests;
    setGuests(Math.min(500, current + 1));
  };

  const decrementGuests = () => {
    const current = typeof guests === 'string' ? parseInt(guests) || 0 : guests;
    setGuests(Math.max(1, current - 1));
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Calculator Form */}
      <Card variant="elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-primary" />
            Smart Quote Builder
          </CardTitle>
          <CardDescription>
            Build professional quotes in seconds with automatic zone pricing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Tour Type */}
          <div className="space-y-2">
            <Label>Tour Type</Label>
            <Select
              value={tourType}
              onValueChange={(v) => setTourType(v as 'full-dubai' | 'full-abudhabi' | 'half-dubai')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select tour type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full-dubai">Full Day Dubai</SelectItem>
                <SelectItem value="full-abudhabi">Full Day Abu Dhabi</SelectItem>
                <SelectItem value="half-dubai">Half Day Dubai</SelectItem>
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
              <SelectTrigger>
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
              Pickup Zone
            </Label>
            <Select value={zone} onValueChange={setZone}>
              <SelectTrigger>
                <SelectValue placeholder="Select pickup zone" />
              </SelectTrigger>
              <SelectContent>
                {zones.map(z => (
                  <SelectItem key={z.zone} value={z.zone.toString()}>
                    Zone {z.zone}: {z.name} ({z.areas.join(', ')})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Guests */}
          <div className="space-y-2">
            <Label className="flex items-center gap-1.5">
              <Users className="h-4 w-4" />
              Number of Guests
            </Label>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={decrementGuests}
                type="button"
                className="h-10 w-10 shrink-0"
                aria-label="Decrease guests"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Input
                type="number"
                min={1}
                max={500}
                value={guests}
                onChange={(e) => handleGuestChange(e.target.value)}
                onBlur={handleGuestBlur}
                className="text-center"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={incrementGuests}
                type="button"
                className="h-10 w-10 shrink-0"
                aria-label="Increase guests"
              >
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
                  className="justify-start text-xs h-auto py-2 transition-all duration-200 hover:scale-105 hover:shadow-soft"
                  onClick={() => {
                    setSelectedAttractions(prev =>
                      prev.includes(attr.id)
                        ? prev.filter(id => id !== attr.id)
                        : [...prev, attr.id]
                    );
                  }}
                >
                  <span className="truncate">{attr.name}</span>
                  <Badge variant="muted" className="ml-auto text-xs">
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
        <Card variant="navy">
          <CardHeader>
            <CardTitle className="text-sidebar-foreground">Quote Preview</CardTitle>
          </CardHeader>
          <CardContent>
            {calculation ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sidebar-foreground/80">
                    <span>Vehicle ({tourType.replace('-', ' ')})</span>
                    <span>AED {calculation.vehicleRate}</span>
                  </div>
                  <div className="flex justify-between text-sidebar-foreground/80">
                    <span>Pickup (Zone {zone})</span>
                    <span>AED {calculation.pickupRate}</span>
                  </div>
                  {calculation.attractionsCost > 0 && (
                    <div className="flex justify-between text-sidebar-foreground/80">
                      <span>Attractions ({guests}x)</span>
                      <span>AED {calculation.attractionsCost}</span>
                    </div>
                  )}
                </div>
                
                <div className="border-t border-sidebar-border pt-4">
                  <div className="flex justify-between text-lg font-semibold text-sidebar-foreground">
                    <span>Total</span>
                    <span className="text-primary">AED {calculation.total}</span>
                  </div>
                  <div className="flex justify-between text-sm text-sidebar-foreground/70 mt-1">
                    <span>Per Person ({guests} guests)</span>
                    <span>AED {calculation.perPerson}</span>
                  </div>
                </div>

                <Button 
                  variant="gold" 
                  className="w-full mt-4 shadow-glow hover:shadow-elevated transition-all duration-300 hover:scale-105"
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
              <p className="text-sidebar-foreground/60 text-center py-8">
                Select vehicle and zone to see quote
              </p>
            )}
          </CardContent>
        </Card>

        {/* Quick Combos */}
        <Card variant="elevated">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Package className="h-4 w-4 text-primary" />
              Quick Combo Packages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {comboPackages.slice(0, 3).map(combo => (
                <div 
                  key={combo.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div>
                    <p className="font-medium text-sm">{combo.name}</p>
                    <p className="text-xs text-muted-foreground">{combo.items.join(' + ')}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary">AED {combo.totalPrice}</p>
                    <Badge variant="success" className="text-xs">Save {combo.savings}</Badge>
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
