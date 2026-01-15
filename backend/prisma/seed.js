import { PrismaClient } from "@prisma/client";
import supabase from '../client.js';

console.log(supabase);
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  /// Creating users to test routes with
  const sampleUsers = [
    { email: "chris@test.com", username: "chris", password: "password" },
    { email: "merling@test.com", username: "merling", password: "password" },
    { email: "karla@test.com", username: "karla", password: "password" },
    { email: "rafiq@test.com", username: "rafiq", password: "password" },
  ];

  /// Sample movies
  const mediaData = [
    {
      tmdbId: 157336,
      title: "Interstellar",
      description:
        "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
      posterUrl: "https://image.tmdb.org/t/p/w500/nBNZadXqJSdt05SHLqgT0HuC5Gm.jpg",
      releaseYear: 2014,
      producer: "Christopher Nolan",
    },
    {
      tmdbId: 27205,
      title: "Inception",
      description:
        "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea.",
      posterUrl: "https://image.tmdb.org/t/p/w500/qmDpIHrmpJINaRKAfWQfftjCdyi.jpg",
      releaseYear: 2010,
      producer: "Christopher Nolan",
    },
  ];

  for (const userData of sampleUsers) {
    /// Pushes sample users (the team) to Supabase
    const { data: signUpData, error: signUpError } = await supabase.auth.admin.createUser({
      email: userData.email,
      password: userData.password,
      email_confirm: true,
      user_metadata: { username: userData.username },
    });

    if (signUpError) {
      console.error('Supabase user error:', signUpError);
      continue;
    }

    const supabaseUser = signUpData.user;
    console.log(`Supabase user seeded: ${userData.username}`)

    /// Creates profiles in prisma that references Supabase UID
    const profile = await prisma.profile.upsert({
      where: { username: userData.username },
      update: {},
      create: {
        username: userData.username,
        email: userData.email,
        userId: supabaseUser.id,
      },
    });

    /// Upsert default favorite playlists for eery user
    const favorites = await prisma.playlist.upsert({
      where: { name_profileId: { name: "Favorites", profileId: profile.userId } },
      update: {},
      create: {
        name: "Favorites",
        isFavorite: true,
        isPublic: false,
        profileId: profile.userId,
        ownerUsername: profile.username,
      },
    });
    console.log(`Favorites playlist created for: ${profile.username}`);

    /// Upsert media & connect them to Favorites playlist
    for (const m of mediaData) {
      const media = await prisma.media.upsert({
        where: { tmdbId: m.tmdbId },
        update: {},
        create: m,
      });

      /// Connect media to playlist if not already connected
      const existingConnection = await prisma.playlistMedia.findUnique({
        where: {
          playlistName_profileId_mediaTmdbId: {
            playlistName: favorites.name,
            profileId: favorites.profileId,
            mediaTmdbId: media.tmdbId,
          },
        },
      });

      if (!existingConnection) {
        await prisma.playlistMedia.create({
          data: {
            playlistName: favorites.name,
            profileId: favorites.profileId,
            mediaTmdbId: media.tmdbId,
          },
        });
        console.log(`'${media.title}' added to ${profile.username}'s Favorites.`);
      }
    }
  }

  console.log("Seeding complete!");
}

main()
  .catch(async (error) => {
    console.error("Seed error:", error);
    await prisma.$disconnect();
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
