import { Controller, Delete, Get, Patch, Post, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { supabase } from './lib/supabase';
import { Database } from './lib/supabase_tyres';

type Post = {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  user_id: string;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post(`/location`)
  async createLocation(@Req() request): Promise<string> {
    const { id, name, lat, long, image } = request.body as Database['public']['Tables']['location']['Insert'];
    if (!id || !name || !lat || !long || image) {
      return `Error: Missing required fields!`;
    }
    const { data, error } = await supabase.from('location').insert({
      id,
      name,
      lat,
      long,
      image,
    });
    if (error) {
      return `Error: ${(error as { message: string }).message}`;
    }
    return `Location created!`;
  }

  @Get(`/locations`)
  async getLocations(): Promise<Database['public']['Tables']['location']['Row'][] | string> {
    const { data, error } = await supabase.from('location').select('*');
    if (Array.isArray(data)) {
      return data as Database['public']['Tables']['location']['Row'][];
    } else if (error) {
      return `Error: ${(error as { message: string }).message}`;
    }
    return `No locations found!`;
  }

  @Patch()
  async patchHello(@Req() request): Promise<string> {
    const { id, name, lat, long, image } = request.body as Database['public']['Tables']['location']['Update'];
    if (!id || !name || !lat || !long) {
      return `Error: Missing required fields!`;
    }
    const { data, error } = await supabase.from('location').update({
      name,
      lat,
      long,
      image,
    }).eq('id', id);
    if (error) {
      return `Error: ${(error as { message: string }).message}`;
    }
    return `Location updated!`;
  }
  
}