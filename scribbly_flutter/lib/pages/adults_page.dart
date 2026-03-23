import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AdultsPage extends StatelessWidget {
  const AdultsPage({super.key});

  @override
  Widget build(BuildContext context) {
    // These would normally come from a global state or provider
    final stats = [
      {'label': 'Words Read', 'value': '124', 'icon': '📖', 'color': const Color(0xFF38BDF8)},
      {'label': 'Mood Logs', 'value': '12', 'icon': '💚', 'color': const Color(0xFF4ADE80)},
      {'label': 'Letters Traced', 'value': '45', 'icon': '🧪', 'color': const Color(0xFFFACC15)},
      {'label': 'Writing Sessions', 'value': '8', 'icon': '✏️', 'color': const Color(0xFFFB7185)},
    ];

    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Center(
        child: Container(
          constraints: const BoxConstraints(maxWidth: 1000),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              _buildHeader(),
              const SizedBox(height: 32),
              GridView.count(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                crossAxisCount: 4,
                mainAxisSpacing: 24,
                crossAxisSpacing: 24,
                childAspectRatio: 1.2,
                children: stats.map((s) => _buildStatCard(s)).toList(),
              ),
              const SizedBox(height: 32),
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(flex: 3, child: _buildActivityLog()),
                  const SizedBox(width: 24),
                  Expanded(flex: 2, child: _buildInsights()),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHeader() {
    return Container(
      padding: const EdgeInsets.all(32),
      decoration: BoxDecoration(
        gradient: const LinearGradient(colors: [Color(0xFF1E40AF), Color(0xFF0369A1)]),
        borderRadius: BorderRadius.circular(24),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.2), blurRadius: 20)],
      ),
      child: Row(
        children: [
          const Text('👩‍🏫', style: TextStyle(fontSize: 56)),
          const SizedBox(width: 24),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Teacher Dashboard', style: GoogleFonts.outfit(fontSize: 28, fontWeight: FontWeight.w900, color: Colors.white)),
              Text('Real-time session analysis and learner engagement insights.', style: TextStyle(color: Colors.white.withOpacity(0.8))),
            ],
          ),
          const Spacer(),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              const Text('ACTIVE SESSION', style: TextStyle(color: Colors.white60, fontSize: 10, fontWeight: FontWeight.w800, letterSpacing: 1.2)),
              Text('14m', style: GoogleFonts.outfit(fontSize: 24, fontWeight: FontWeight.w900, color: Colors.white)),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildStatCard(Map<String, dynamic> stat) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B),
        borderRadius: BorderRadius.circular(20),
        border: Border(bottom: BorderSide(color: stat['color'] as Color, width: 4)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text('${stat['icon']} ${stat['label']}', style: GoogleFonts.plusJakartaSans(fontSize: 12, fontWeight: FontWeight.w800, color: Colors.white60)),
          Text(stat['value'] as String, style: GoogleFonts.outfit(fontSize: 32, fontWeight: FontWeight.w900, color: Colors.white)),
        ],
      ),
    );
  }

  Widget _buildActivityLog() {
    final activities = [
      {'d': 'Converted word "Elephant"', 't': '10:45 PM'},
      {'d': 'Read "The Little Seed"', 't': '10:42 PM'},
      {'d': 'Traced letter "b"', 't': '10:38 PM'},
      {'d': 'Scored 5 in Visual Match', 't': '10:35 PM'},
    ];

    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: Colors.white10),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Live Activity Log', style: GoogleFonts.outfit(fontSize: 20, fontWeight: FontWeight.w800, color: Colors.white)),
          const SizedBox(height: 24),
          ...activities.map((a) => Container(
            margin: const EdgeInsets.only(bottom: 12),
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.03),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: Colors.white.withOpacity(0.05)),
            ),
            child: Row(
              children: [
                Container(width: 8, height: 8, decoration: const BoxDecoration(shape: BoxShape.circle, color: Color(0xFF38BDF8))),
                const SizedBox(width: 16),
                Expanded(child: Text(a['d']!, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w500))),
                Text(a['t']!, style: const TextStyle(color: Colors.white38, fontSize: 12)),
              ],
            ),
          )),
        ],
      ),
    );
  }

  Widget _buildInsights() {
    return Column(
      children: [
        _buildInsightCard(
          'Evidence Focus',
          'Based on current activity, the learner is showing strong engagement in Visual Matching. This is an excellent exercise for spatial awareness.',
          const Color(0xFF38BDF8),
        ),
        const SizedBox(height: 24),
        Container(
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(
            color: const Color(0xFF1E293B),
            borderRadius: BorderRadius.circular(24),
            border: Border.all(color: Colors.white10),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Support Strategies', style: GoogleFonts.outfit(fontSize: 16, fontWeight: FontWeight.w800, color: Colors.white)),
              const SizedBox(height: 16),
              _buildStrategy('🎯', 'Praise the Process', 'Acknowledge the effort in memory games.'),
              _buildStrategy('⏳', 'Give Space', 'Allow extra time for decoding words.'),
              _buildStrategy('🎨', 'Vibrant Inputs', 'Multisensory feedback improves retention.'),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildInsightCard(String title, String desc, Color color) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: color.withOpacity(0.2)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title, style: GoogleFonts.outfit(fontSize: 16, fontWeight: FontWeight.w800, color: color)),
          const SizedBox(height: 12),
          Text(desc, style: const TextStyle(color: Colors.white70, height: 1.6)),
        ],
      ),
    );
  }

  Widget _buildStrategy(String emoji, String title, String desc) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(emoji, style: const TextStyle(fontSize: 18)),
          const SizedBox(width: 12),
          Expanded(
            child: RichText(
              text: TextSpan(
                style: const TextStyle(color: Colors.white70, fontSize: 13, height: 1.4),
                children: [
                  TextSpan(text: '$title: ', style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.white)),
                  TextSpan(text: desc),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
