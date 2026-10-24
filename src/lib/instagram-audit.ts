import { AuditReport, AuditSection } from './types'

interface InstagramProfileData {
  username: string
  fullName: string
  biography: string
  followersCount: number
  followingCount: number
  postsCount: number
  isBusinessAccount: boolean
  profilePicUrl: string
  externalUrl: string
  recentPosts: {
    type: 'image' | 'video' | 'carousel'
    likesCount: number
    commentsCount: number
    caption: string
    timestamp: string
  }[]
}

export function runInstagramAudit(data: InstagramProfileData): AuditReport {
  const sections: AuditSection[] = []

  // 1. Bio Analysis
  const bio = data.biography || ''
  const hasCTA = /book|dm|whatsapp|link|contact|call/i.test(bio)
  const hasLocation = /delhi|ncr|gurgaon|noida|mumbai|india/i.test(bio)
  const hasEmoji = /[\u{1F300}-\u{1FAFF}]/u.test(bio)
  const hasBookingLink = !!data.externalUrl
  const bioScore = (hasCTA ? 3 : 0) + (hasLocation ? 2 : 0) + (hasEmoji ? 1 : 0) + (hasBookingLink ? 4 : 0)

  sections.push({
    name: 'Bio & First Impression',
    nameHi: 'बायो और पहली छाप',
    score: Math.min(bioScore, 10),
    maxScore: 10,
    status: bioScore >= 7 ? 'good' : bioScore >= 4 ? 'warning' : 'critical',
    finding: !hasBookingLink
      ? 'You have NO booking link in your bio. Every bride who visits your profile has to DM you, and 70% of them won\'t bother.'
      : !hasCTA
      ? 'You have a link but no clear call-to-action telling brides what to do.'
      : 'Your bio has the basics covered.',
    findingHi: !hasBookingLink
      ? 'आपके बायो में कोई बुकिंग लिंक नहीं है। हर ब्राइड जो आपकी प्रोफाइल देखती है, उसे DM करना पड़ता है — 70% ऐसा नहीं करतीं।'
      : !hasCTA
      ? 'लिंक तो है, लेकिन ब्राइड को साफ़ नहीं बताया कि क्या करें।'
      : 'आपके बायो में बेसिक चीज़ें हैं।',
    fix: !hasBookingLink
      ? 'Add your BookMyGlow link in bio RIGHT NOW. Then write: "✨ Bridal & Party MUA | Delhi NCR | Book below 👇" — this alone can get you 2-3x more enquiries.'
      : !hasCTA
      ? 'Add "Book your look 👇" or "See prices & book instantly 👇" above your link.'
      : 'Keep it updated with your latest work and seasonal offers.',
    fixHi: !hasBookingLink
      ? 'अभी अपना BookMyGlow लिंक बायो में डालें। लिखें: "✨ Bridal & Party MUA | Delhi NCR | नीचे बुक करें 👇" — इससे 2-3 गुना ज़्यादा enquiry आ सकती है।'
      : !hasCTA
      ? '"अपना लुक बुक करें 👇" या "Price देखें और बुक करें 👇" अपने लिंक के ऊपर लिखें।'
      : 'इसे अपने latest काम और seasonal offers से अपडेट रखें।',
    impact: 'high',
  })

  // 2. Follower-to-Engagement Ratio
  const avgLikes = data.recentPosts.length > 0
    ? data.recentPosts.reduce((sum, p) => sum + p.likesCount, 0) / data.recentPosts.length
    : 0
  const avgComments = data.recentPosts.length > 0
    ? data.recentPosts.reduce((sum, p) => sum + p.commentsCount, 0) / data.recentPosts.length
    : 0
  const engagementRate = data.followersCount > 0
    ? ((avgLikes + avgComments) / data.followersCount) * 100
    : 0
  const engScore = engagementRate > 5 ? 10 : engagementRate > 3 ? 7 : engagementRate > 1 ? 4 : 2

  sections.push({
    name: 'Engagement Rate',
    nameHi: 'एंगेजमेंट रेट',
    score: engScore,
    maxScore: 10,
    status: engScore >= 7 ? 'good' : engScore >= 4 ? 'warning' : 'critical',
    finding: engagementRate < 1
      ? `Your engagement rate is ${engagementRate.toFixed(1)}%. This means your posts are NOT reaching your followers. Instagram is hiding you.`
      : engagementRate < 3
      ? `Engagement rate: ${engagementRate.toFixed(1)}%. Average, but you're leaving money on the table.`
      : `Strong engagement at ${engagementRate.toFixed(1)}%. Your audience trusts you.`,
    findingHi: engagementRate < 1
      ? `आपका engagement rate ${engagementRate.toFixed(1)}% है। इसका मतलब आपकी पोस्ट आपके followers तक नहीं पहुँच रही। Instagram आपको छुपा रहा है।`
      : engagementRate < 3
      ? `Engagement rate: ${engagementRate.toFixed(1)}%। ठीक-ठाक है, लेकिन बहुत scope है।`
      : `बहुत अच्छा engagement ${engagementRate.toFixed(1)}%। आपकी audience आप पर भरोसा करती है।`,
    fix: engagementRate < 3
      ? 'Post "before & after" reels — they get 3x more saves. Ask questions in captions: "Which look would you pick for your sangeet?" Reply to EVERY comment within 1 hour.'
      : 'Keep doing what you\'re doing. Add story polls asking followers to pick between two looks — this trains Instagram to show you more.',
    fixHi: engagementRate < 3
      ? '"Before & after" reels डालें — 3x ज़्यादा saves मिलते हैं। कैप्शन में सवाल पूछें: "संगीत के लिए कौन सा look चुनोगी?" हर कमेंट का 1 घंटे में जवाब दें।'
      : 'जो कर रही हो वो करते रहो। Story polls डालो जहाँ followers दो looks में से एक चुनें — इससे Instagram आपको ज़्यादा दिखाएगा।',
    impact: 'high',
  })

  // 3. Content Mix (Reels vs Static)
  const reelsCount = data.recentPosts.filter(p => p.type === 'video').length
  const reelsPercent = data.recentPosts.length > 0 ? (reelsCount / data.recentPosts.length) * 100 : 0
  const contentScore = reelsPercent >= 40 && reelsPercent <= 70 ? 10 : reelsPercent >= 20 ? 6 : 2

  sections.push({
    name: 'Content Mix',
    nameHi: 'कंटेंट मिक्स',
    score: contentScore,
    maxScore: 10,
    status: contentScore >= 7 ? 'good' : contentScore >= 4 ? 'warning' : 'critical',
    finding: reelsPercent < 20
      ? `Only ${reelsPercent.toFixed(0)}% of your posts are Reels. In 2024, Instagram pushes Reels 4x more than photos. You're invisible to new brides.`
      : reelsPercent > 70
      ? `${reelsPercent.toFixed(0)}% Reels is too much. You need carousel posts for brides who want to study your work closely before booking.`
      : `Good mix: ${reelsPercent.toFixed(0)}% Reels. Balanced content strategy.`,
    findingHi: reelsPercent < 20
      ? `आपकी सिर्फ ${reelsPercent.toFixed(0)}% पोस्ट Reels हैं। 2024 में Instagram Reels को फ़ोटो से 4 गुना ज़्यादा push करता है। नई brides को आप दिख ही नहीं रहीं।`
      : reelsPercent > 70
      ? `${reelsPercent.toFixed(0)}% Reels बहुत ज़्यादा है। Carousel posts भी चाहिए — brides बुक करने से पहले आपका काम ध्यान से देखती हैं।`
      : `अच्छा mix: ${reelsPercent.toFixed(0)}% Reels। बैलेंस्ड strategy।`,
    fix: reelsPercent < 20
      ? 'Start with ONE reel per week: film a 15-sec getting-ready clip of your bride. Use trending audio. Add text overlay "Bridal Glam | Delhi". No fancy editing needed — raw is authentic.'
      : 'Add 2 carousel posts per week: 5-slide before/after + close-up details. These get saved by brides planning their wedding look.',
    fixHi: reelsPercent < 20
      ? 'हफ्ते में एक Reel से शुरू करें: bride की 15 सेकंड getting-ready clip बनाएं। Trending audio लगाएं। Text overlay: "Bridal Glam | Delhi"। Fancy editing की ज़रूरत नहीं — raw authentic लगता है।'
      : 'हफ्ते में 2 carousel posts डालें: 5 slides — before/after + close-up details। Brides इन्हें save करती हैं wedding look plan करते समय।',
    impact: 'high',
  })

  // 4. Posting Frequency
  const postDates = data.recentPosts.map(p => new Date(p.timestamp))
  const daysBetween = postDates.length > 1
    ? (postDates[0].getTime() - postDates[postDates.length - 1].getTime()) / (1000 * 60 * 60 * 24)
    : 30
  const postsPerWeek = postDates.length > 0 ? (data.recentPosts.length / daysBetween) * 7 : 0
  const freqScore = postsPerWeek >= 3 ? 10 : postsPerWeek >= 2 ? 7 : postsPerWeek >= 1 ? 4 : 1

  sections.push({
    name: 'Posting Frequency',
    nameHi: 'पोस्टिंग फ्रीक्वेंसी',
    score: freqScore,
    maxScore: 10,
    status: freqScore >= 7 ? 'good' : freqScore >= 4 ? 'warning' : 'critical',
    finding: postsPerWeek < 1
      ? `You\'re posting less than once a week. Instagram\'s algorithm forgets you exist after 3 days of silence.`
      : postsPerWeek < 3
      ? `Posting ${postsPerWeek.toFixed(1)}x per week. Functional, but top artists post 4-5x.`
      : `Great consistency: ${postsPerWeek.toFixed(1)} posts/week. The algorithm loves you.`,
    findingHi: postsPerWeek < 1
      ? `आप हफ्ते में एक बार से भी कम post कर रही हैं। 3 दिन चुप रहने पर Instagram भूल जाता है कि आप exist करती हैं।`
      : postsPerWeek < 3
      ? `हफ्ते में ${postsPerWeek.toFixed(1)} बार पोस्ट कर रही हैं। ठीक है, पर top artists 4-5 बार करती हैं।`
      : `बहुत अच्छी consistency: हफ्ते में ${postsPerWeek.toFixed(1)} posts। Algorithm आपको पसंद करता है।`,
    fix: postsPerWeek < 2
      ? 'Batch content: spend 1 hour after every bride shoot — take 10 photos, film 3 clips. That gives you a week of content. Schedule with Later or Buffer app (free).'
      : 'You\'re consistent. Now focus on posting at peak times: 11am and 7pm IST get the most bridal audience eyeballs.',
    fixHi: postsPerWeek < 2
      ? 'Content batch करें: हर bride shoot के बाद 1 घंटा — 10 photos लें, 3 clips बनाएं। एक हफ्ते का content हो जाएगा। Later या Buffer app (free) से schedule करें।'
      : 'Consistent हो आप। अब peak time पर post करें: सुबह 11 बजे और शाम 7 बजे — bridal audience सबसे ज़्यादा active रहती है।',
    impact: 'medium',
  })

  // 5. Hashtag Strategy
  const allCaptions = data.recentPosts.map(p => p.caption).join(' ')
  const hashtagMatches = allCaptions.match(/#\w+/g) || []
  const avgHashtags = data.recentPosts.length > 0 ? hashtagMatches.length / data.recentPosts.length : 0
  const hasLocalHashtags = /delhi|ncr|gurgaon|noida/i.test(allCaptions)
  const hasBridalHashtags = /bridal|bride|wedding|dulhan|shaadi/i.test(allCaptions)
  const hashScore = (avgHashtags >= 5 && avgHashtags <= 15 ? 4 : 1) + (hasLocalHashtags ? 3 : 0) + (hasBridalHashtags ? 3 : 0)

  sections.push({
    name: 'Hashtag Strategy',
    nameHi: 'हैशटैग स्ट्रैटेजी',
    score: Math.min(hashScore, 10),
    maxScore: 10,
    status: hashScore >= 7 ? 'good' : hashScore >= 4 ? 'warning' : 'critical',
    finding: !hasLocalHashtags
      ? 'You\'re NOT using location hashtags. Brides search for "Delhi makeup artist" and you\'re not showing up.'
      : avgHashtags < 5
      ? `Only ${avgHashtags.toFixed(0)} hashtags per post. You should use 8-12 targeted ones.`
      : 'Your hashtag game is decent.',
    findingHi: !hasLocalHashtags
      ? 'आप location hashtags इस्तेमाल नहीं कर रही हैं। Brides "Delhi makeup artist" search करती हैं और आप दिख नहीं रही हैं।'
      : avgHashtags < 5
      ? `सिर्फ ${avgHashtags.toFixed(0)} hashtags per post। 8-12 targeted hashtags use करें।`
      : 'आपकी hashtag strategy ठीक है।',
    fix: 'Use these exact hashtags on every post: #DelhiMakeupArtist #BridalMakeupDelhi #DelhiWedding #MakeupArtistDelhi #WeddingMakeupNCR #IndianBride #DulhanMakeup. Mix in 3-4 niche ones per post like #AirbrushMakeup or #SouthDelhiMUA.',
    fixHi: 'हर पोस्ट पर ये hashtags लगाएं: #DelhiMakeupArtist #BridalMakeupDelhi #DelhiWedding #MakeupArtistDelhi #WeddingMakeupNCR #IndianBride #DulhanMakeup। साथ में 3-4 niche hashtags जैसे #AirbrushMakeup या #SouthDelhiMUA।',
    impact: 'medium',
  })

  // 6. Business Account
  const bizScore = data.isBusinessAccount ? 10 : 0
  sections.push({
    name: 'Business Account Setup',
    nameHi: 'बिज़नेस अकाउंट',
    score: bizScore,
    maxScore: 10,
    status: bizScore >= 7 ? 'good' : 'critical',
    finding: !data.isBusinessAccount
      ? 'You\'re using a personal account. You\'re missing insights, contact buttons, and the ability to run ads. This is the #1 easiest fix.'
      : 'Good — you have a business account. Make sure your category is set to "Makeup Artist".',
    findingHi: !data.isBusinessAccount
      ? 'आप personal account use कर रही हैं। Insights, contact buttons, और ads चलाने की ability — सब miss हो रहा है। ये सबसे आसान fix है।'
      : 'अच्छा — business account है। Category "Makeup Artist" सेट है ना?',
    fix: !data.isBusinessAccount
      ? 'Go to Settings → Account → Switch to Professional Account → Choose "Makeup Artist" category. Takes 30 seconds. Gives you analytics on who views your profile.'
      : 'Make sure your Contact button shows your WhatsApp/phone. Many artists forget this.',
    fixHi: !data.isBusinessAccount
      ? 'Settings → Account → Switch to Professional Account → "Makeup Artist" category चुनें। 30 second का काम है। आपको बताएगा कौन आपकी profile देखता है।'
      : 'Contact button पर WhatsApp/phone दिख रहा है ना? बहुत सी artists ये भूल जाती हैं।',
    impact: 'high',
  })

  // 7. Caption Quality
  const avgCaptionLen = data.recentPosts.length > 0
    ? data.recentPosts.reduce((sum, p) => sum + (p.caption?.length || 0), 0) / data.recentPosts.length
    : 0
  const hasCaptionCTA = data.recentPosts.some(p => /book|dm|comment|save|share|tag/i.test(p.caption))
  const captionScore = (avgCaptionLen > 100 ? 4 : avgCaptionLen > 50 ? 2 : 0) + (hasCaptionCTA ? 4 : 0) + (avgCaptionLen > 30 ? 2 : 0)

  sections.push({
    name: 'Caption Strategy',
    nameHi: 'कैप्शन स्ट्रैटेजी',
    score: Math.min(captionScore, 10),
    maxScore: 10,
    status: captionScore >= 7 ? 'good' : captionScore >= 4 ? 'warning' : 'critical',
    finding: avgCaptionLen < 50
      ? 'Your captions are too short. You\'re not giving Instagram any text to understand your content, and not giving brides any reason to engage.'
      : !hasCaptionCTA
      ? 'Your captions lack a call-to-action. Every post should tell the bride what to do next.'
      : 'Your captions are working. Keep telling stories.',
    findingHi: avgCaptionLen < 50
      ? 'आपके captions बहुत छोटे हैं। Instagram को समझ नहीं आ रहा content क्या है, और brides को engage होने की वजह नहीं मिल रही।'
      : !hasCaptionCTA
      ? 'Captions में call-to-action नहीं है। हर post में bride को बताएं कि अगला कदम क्या है।'
      : 'Captions अच्छे हैं। Stories बताते रहें।',
    fix: 'Template: "[Bride name]\'s [event] look ✨\n\nProducts: [list 2-3]\nSkin prep: [1 tip]\n\n📍 Delhi NCR | DM to book your date\n\nSave this for your wedding inspo! 💕"',
    fixHi: 'Template: "[Bride का नाम] का [event] look ✨\n\nProducts: [2-3 लिखें]\nSkin prep: [1 tip]\n\n📍 Delhi NCR | बुक करने के लिए DM करें\n\nWedding inspo के लिए save करो! 💕"',
    impact: 'medium',
  })

  // 8. Profile Picture Quality
  const hasProfilePic = !!data.profilePicUrl && !data.profilePicUrl.includes('default')
  sections.push({
    name: 'Profile Picture',
    nameHi: 'प्रोफाइल फ़ोटो',
    score: hasProfilePic ? 8 : 2,
    maxScore: 10,
    status: hasProfilePic ? 'good' : 'critical',
    finding: hasProfilePic
      ? 'You have a profile photo. Make sure it\'s a clear headshot of YOU (not your work). Brides book people, not logos.'
      : 'No proper profile photo. Brides won\'t trust a faceless account.',
    findingHi: hasProfilePic
      ? 'Profile photo है। ये आपका clear headshot होना चाहिए (काम की photo नहीं)। Brides लोगों को book करती हैं, logos को नहीं।'
      : 'ठीक से profile photo नहीं है। Brides बिना चेहरे वाले account पर trust नहीं करतीं।',
    fix: 'Use a well-lit headshot of yourself with subtle makeup. Warm tones. Slight smile. This is your first impression — make it count.',
    fixHi: 'अपनी एक अच्छी headshot लगाएं — अच्छी light में, subtle makeup के साथ। Warm tones। हल्की smile। ये आपकी पहली impression है।',
    impact: 'medium',
  })

  // 9. Follower/Following Ratio
  const ratio = data.followingCount > 0 ? data.followersCount / data.followingCount : 0
  const ratioScore = ratio > 2 ? 10 : ratio > 1 ? 7 : ratio > 0.5 ? 4 : 2

  sections.push({
    name: 'Follower Ratio',
    nameHi: 'फॉलोअर रेशियो',
    score: ratioScore,
    maxScore: 10,
    status: ratioScore >= 7 ? 'good' : ratioScore >= 4 ? 'warning' : 'critical',
    finding: ratio < 1
      ? `You follow more people (${data.followingCount}) than follow you (${data.followersCount}). This makes your profile look unprofessional.`
      : `Healthy ratio: ${data.followersCount} followers vs ${data.followingCount} following.`,
    findingHi: ratio < 1
      ? `आप ज़्यादा लोगों को follow करती हैं (${data.followingCount}) बजाय जो आपको follow करते हैं (${data.followersCount})। ये unprofessional दिखता है।`
      : `अच्छा ratio: ${data.followersCount} followers vs ${data.followingCount} following.`,
    fix: ratio < 1
      ? 'Unfollow accounts that don\'t follow you back (use the "Least Interacted With" feature in Following). Keep following under 500. Focus on getting organic followers through content.'
      : 'Good ratio. Focus on growing organically through content, not follow-for-follow.',
    fixHi: ratio < 1
      ? 'जो follow back नहीं करते उन्हें unfollow करें ("Least Interacted With" feature use करें)। Following 500 से कम रखें। Content से organic followers बढ़ाएं।'
      : 'अच्छा ratio। Content से organic growth पर focus करें, follow-for-follow नहीं।',
    impact: 'low',
  })

  // 10. Highlights & Story Strategy
  const highlightsScore = 6 // Placeholder — can't assess highlights without API access
  sections.push({
    name: 'Stories & Highlights',
    nameHi: 'स्टोरीज़ और हाइलाइट्स',
    score: highlightsScore,
    maxScore: 10,
    status: 'warning',
    finding: 'Make sure you have these Highlights: "Brides" (recent work), "Reviews" (screenshots of client messages), "Process" (behind the scenes), "Book" (how to book you).',
    findingHi: 'ये Highlights ज़रूर बनाएं: "Brides" (recent काम), "Reviews" (clients के messages के screenshots), "Process" (behind the scenes), "Book" (कैसे बुक करें)।',
    fix: 'Create 4 Highlight covers matching your aesthetic. Pin your best bride review story. Post stories daily — even a simple "getting ready for today\'s bride" builds trust.',
    fixHi: '4 Highlight covers बनाएं जो आपके aesthetic से match करें। सबसे अच्छा bride review story pin करें। Daily stories डालें — "आज की bride की तैयारी" जैसा simple content भी trust बनाता है।',
    impact: 'medium',
  })

  const overallScore = Math.round(sections.reduce((sum, s) => sum + s.score, 0) / sections.reduce((sum, s) => sum + s.maxScore, 0) * 100)

  const criticalSections = sections.filter(s => s.status === 'critical')
  const topPriority = criticalSections.length > 0
    ? criticalSections.sort((a, b) => (b.impact === 'high' ? 1 : 0) - (a.impact === 'high' ? 1 : 0))[0].fix
    : sections.filter(s => s.status === 'warning')[0]?.fix || 'Keep up the great work!'

  return {
    overallScore,
    sections,
    topPriority,
    generatedAt: new Date().toISOString(),
  }
}

// Questionnaire-based audit for when API isn't connected
export function runQuestionnaireAudit(answers: Record<string, string | number | boolean>): AuditReport {
  const mockData: InstagramProfileData = {
    username: (answers.username as string) || '',
    fullName: (answers.fullName as string) || '',
    biography: (answers.hasBioLink ? 'book now at link' : '') + (answers.hasLocation ? ' Delhi NCR' : ''),
    followersCount: (answers.followers as number) || 0,
    followingCount: (answers.following as number) || 0,
    postsCount: (answers.totalPosts as number) || 0,
    isBusinessAccount: (answers.isBusinessAccount as boolean) || false,
    profilePicUrl: answers.hasProfilePic ? 'exists' : '',
    externalUrl: answers.hasBioLink ? 'https://example.com' : '',
    recentPosts: Array.from({ length: (answers.postsPerWeek as number) || 1 }, (_, i) => ({
      type: (answers.postsReels as boolean) ? (i % 2 === 0 ? 'video' as const : 'image' as const) : 'image' as const,
      likesCount: Math.round(((answers.avgLikes as number) || 10)),
      commentsCount: Math.round(((answers.avgComments as number) || 2)),
      caption: (answers.captionLength as string) === 'long' ? 'A'.repeat(150) + (answers.usesCTA ? ' book now' : '') : 'A'.repeat(30),
      timestamp: new Date(Date.now() - i * 2 * 24 * 60 * 60 * 1000).toISOString(),
    })),
  }

  return runInstagramAudit(mockData)
}
