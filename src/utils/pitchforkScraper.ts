import axios from 'axios';
import * as cheerio from 'cheerio';
import { PitchforkReview } from '@/types';

const PITCHFORK_URL = 'https://pitchfork.com/reviews/albums/';
const CORS_PROXY = 'https://api.allorigins.win/raw?url=';

export async function scrapePitchforkReviews(): Promise<PitchforkReview[]> {
  try {
    console.log('Fetching Pitchfork reviews...');

    const response = await axios.get(`${CORS_PROXY}${encodeURIComponent(PITCHFORK_URL)}`, {
      headers: {
        'Accept': 'text/html'
      }
    });

    if (!response.data) {
      throw new Error('Empty response from Pitchfork');
    }

    const $ = cheerio.load(response.data);
    const reviews: PitchforkReview[] = [];

    // Updated selectors for current Pitchfork structure
    $('.review').each((_, element) => {
      try {
        const $review = $(element);

        // Extract artist and album
        const titleElement = $review.find('.review__title-album');
        const artistElement = $review.find('.review__title-artist');

        const albumName = titleElement.text().trim();
        const artist = artistElement.text().trim();

        // Get the review URL
        const link = 'https://pitchfork.com' + ($review.find('a.review__link').attr('href') || '');

        // Extract score
        const scoreElement = $review.find('.score');
        const score = parseFloat(scoreElement.text().trim());

        // Get publication date
        const dateElement = $review.find('time');
        const publishDate = dateElement.attr('datetime') || '';

        if (artist && albumName && !isNaN(score)) {
          console.log(`Found review: ${artist} - ${albumName} (${score})`);
          reviews.push({
            title: `${artist}: ${albumName}`,
            link,
            score,
            publishDate,
            content: '', // Content would require additional request to review page
            artist,
            albumName
          });
        }
      } catch (error) {
        console.error('Error parsing individual review:', error);
      }
    });

    console.log(`Successfully scraped ${reviews.length} reviews`);

    if (reviews.length === 0) {
      // Log the HTML structure for debugging
      console.log('Page HTML structure:', $.html());
      throw new Error('No reviews found - possible selector mismatch');
    }

    return reviews;
  } catch (error) {
    console.error('Error scraping Pitchfork reviews:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error('Response error:', {
          status: error.response.status,
          statusText: error.response.statusText
        });
      } else if (error.request) {
        console.error('Request error:', error.message);
      }
    }
    throw error;
  }
}
