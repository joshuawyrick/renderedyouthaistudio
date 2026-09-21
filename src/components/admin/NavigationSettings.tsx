
import React, { useState, useEffect } from 'react';
import { RYCard } from '@/components/ui/ry-card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

const NavigationSettings = () => {
  const [settings, setSettings] = useState({
    show_age_groups: true
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('platform_settings')
        .select('setting_key, setting_value')
        .eq('setting_key', 'show_age_groups_in_nav');

      if (error) throw error;

      if (data && data.length > 0) {
        setSettings({
          show_age_groups: data[0].setting_value === 'true'
        });
      }
    } catch (error) {
      console.error('Error fetching navigation settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (key: string, value: boolean) => {
    try {
      const { error } = await supabase
        .from('platform_settings')
        .upsert({
          setting_key: key,
          setting_value: value.toString(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'setting_key'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Navigation settings updated",
      });
    } catch (error) {
      console.error('Error updating setting:', error);
      toast({
        title: "Error",
        description: "Failed to update settings",
        variant: "destructive",
      });
    }
  };

  const handleAgeGroupToggle = (checked: boolean) => {
    setSettings(prev => ({ ...prev, show_age_groups: checked }));
    updateSetting('show_age_groups_in_nav', checked);
  };

  if (loading) {
    return <div>Loading navigation settings...</div>;
  }

  return (
    <RYCard className="p-6">
      <h3 className="text-lg font-medium mb-4">Navigation Settings</h3>
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="show_age_groups"
            checked={settings.show_age_groups}
            onCheckedChange={handleAgeGroupToggle}
          />
          <Label htmlFor="show_age_groups">Show age group links in Shop dropdown</Label>
        </div>
      </div>
    </RYCard>
  );
};

export default NavigationSettings;
