import { Controller, Delete, Get, Patch, Post, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { supabase } from './lib/supabase';
import { Database } from './lib/supabase_tyres';
import { PostgrestError } from '@supabase/supabase-js';

type Post = {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  user_id: string;
};

type ErrorJSON = {
  error:
    | {
        error: string;
        message: string;
        code?: string;
      }
    | PostgrestError;
};

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/achievements/claim')
  async claimAchievement(
    @Req() request,
  ): Promise<
    | Database['public']['Tables']['achievements']['Row']
    | ErrorJSON
    | PostgrestError
  > {
    const { user_id, score } = request.body as {
      user_id: string;
      score: number;
    };
    if (!user_id || !score) {
      return {
        error: {
          error: `Fields!`,
          message: `Error: Missing required fields!`,
          code: `MISSING_FIELDS`,
        },
      };
    }
    const { data, error } = await supabase
      .from('achievements')
      .insert({ user_id })
      .select(`*`);
    if (error) {
      return { error: error };
    }
    return data[0];
  }

  @Post(`/location`)
  async createLocation(@Req() request): Promise<string> {
    const { id, name, lat, long, image } = request.body as Database['public']['Tables']['location']['Insert'];
    if (!id || !name || !lat || !long || image) {
      return `Error: Missing required fields!`;
    }
    const { error } = await supabase.from('location').insert({
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
  async getLocations(): Promise<
    Database['public']['Tables']['location']['Row'][] | string
  > {
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
    const { data, error } = await supabase
      .from('location')
      .update({
        name,
        lat,
        long,
        image,
      })
      .eq('id', id);
    if (error) {
      return `Error: ${(error as { message: string }).message}`;
    }
    return `Location updated!`;
  }
}