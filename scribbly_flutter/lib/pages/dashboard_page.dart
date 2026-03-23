import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'writing_page.dart';
import 'reading_page.dart';
import 'memory_page.dart';
import 'feel_page.dart';
import 'adults_page.dart';
import 'training_page.dart';
import 'settings_page.dart';

class DashboardPage extends StatefulWidget {
  const DashboardPage({super.key});

  @override
  State<DashboardPage> createState() => _DashboardPageState();
}

class _DashboardPageState extends State<DashboardPage> {
  int _selectedIndex = 0;
  bool _dyslexicFont = false;
  bool _rulerActive = false;
  double _rulerY = 100;

  final List<Map<String, dynamic>> _tabs = [
    {'id': 'write', 'icon': Icons.edit, 'label': 'Write', 'emoji': '✏️'},
    {'id': 'read', 'icon': Icons.menu_book, 'label': 'Read', 'emoji': '📖'},
    {'id': 'memory', 'icon': Icons.psychology, 'label': 'Brain', 'emoji': '🧠'},
    {'id': 'feel', 'icon': Icons.favorite, 'label': 'Feel', 'emoji': '💚'},
    {'id': 'adults', 'icon': Icons.school, 'label': 'Adults', 'emoji': '👩‍🏫'},
    {'id': 'training', 'icon': Icons.science, 'label': 'Lab', 'emoji': '🧪'},
    {'id': 'about', 'icon': Icons.info, 'label': 'About', 'emoji': 'ℹ️'},
  ];

  Widget _renderPage() {
    switch (_tabs[_selectedIndex]['id']) {
      case 'write':
        return const WritingPage();
      case 'read':
        return const ReadingPage();
      case 'memory':
        return const MemoryPage();
      case 'feel':
        return const FeelPage();
      case 'adults':
        return const AdultsPage();
      case 'training':
        return const TrainingPage();
      case 'about':
        return const SettingsPage();
      default:
        return const WritingPage();
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDesktop = MediaQuery.of(context).size.width >= 768;

    return Theme(
      data: Theme.of(context).copyWith(
        textTheme: _dyslexicFont 
          ? GoogleFonts.lexendTextTheme(Theme.of(context).textTheme)
          : GoogleFonts.plusJakartaSansTextTheme(Theme.of(context).textTheme),
      ),
      child: Scaffold(
        backgroundColor: const Color(0xFF0F172A),
        appBar: AppBar(
          backgroundColor: const Color(0xFF0A1A3A),
          elevation: 4,
          title: Row(
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Scribbly',
                    style: GoogleFonts.outfit(
                      fontSize: 18,
                      fontWeight: FontWeight.w900,
                      color: Colors.white,
                      letterSpacing: -0.5,
                    ),
                  ),
                  Text(
                    'SPECIAL MINDS',
                    style: GoogleFonts.outfit(
                      fontSize: 9,
                      color: const Color(0xFF38BDF8),
                      fontWeight: FontWeight.w800,
                      letterSpacing: 1.0,
                    ),
                  ),
                ],
              ),
            ],
          ),
          actions: [
            if (isDesktop) ..._tabs.map((t) {
              final index = _tabs.indexOf(t);
              final isSelected = _selectedIndex == index;
              return Padding(
                padding: const EdgeInsets.symmetric(horizontal: 4),
                child: TextButton(
                  onPressed: () => setState(() => _selectedIndex = index),
                  style: TextButton.styleFrom(
                    backgroundColor: isSelected ? Colors.white.withOpacity(0.15) : Colors.transparent,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                  ),
                  child: Row(
                    children: [
                      Text(t['emoji'], style: const TextStyle(fontSize: 18)),
                      const SizedBox(width: 8),
                      Text(
                        t['label'],
                        style: GoogleFonts.plusJakartaSans(
                          color: isSelected ? Colors.white : Colors.white60,
                          fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                        ),
                      ),
                    ],
                  ),
                ),
              );
            }),
            const SizedBox(width: 16),
            IconButton(
              icon: Icon(_rulerActive ? Icons.straighten : Icons.straighten_outlined, color: Colors.white),
              onPressed: () => setState(() => _rulerActive = !_rulerActive),
              tooltip: 'Reading Ruler',
            ),
            IconButton(
              icon: Text('Aa', style: TextStyle(color: Colors.white, fontWeight: _dyslexicFont ? FontWeight.bold : FontWeight.normal)),
              onPressed: () => setState(() => _dyslexicFont = !_dyslexicFont),
              tooltip: 'Dyslexic Font',
            ),
            IconButton(
              icon: const Icon(Icons.logout, color: Colors.redAccent),
              onPressed: () => Supabase.instance.client.auth.signOut(),
              tooltip: 'Logout',
            ),
            const SizedBox(width: 8),
          ],
        ),
        body: Stack(
          children: [
            _renderPage(),
            if (_rulerActive)
              Positioned(
                top: _rulerY,
                left: 0,
                right: 0,
                child: GestureDetector(
                  onVerticalDragUpdate: (details) {
                    setState(() {
                      _rulerY += details.delta.dy;
                    });
                  },
                  child: Container(
                    height: 60,
                    color: Colors.yellow.withOpacity(0.2),
                    child: Container(
                      decoration: BoxDecoration(
                        border: Border(
                          top: BorderSide(color: Colors.yellow.withOpacity(0.5), width: 2),
                          bottom: BorderSide(color: Colors.yellow.withOpacity(0.5), width: 2),
                        ),
                      ),
                    ),
                  ),
                ),
              ),
          ],
        ),
        bottomNavigationBar: !isDesktop ? BottomNavigationBar(
          currentIndex: _selectedIndex,
          onTap: (index) => setState(() => _selectedIndex = index),
          backgroundColor: const Color(0xFF0A1A3A),
          selectedItemColor: const Color(0xFF38BDF8),
          unselectedItemColor: Colors.white60,
          type: BottomNavigationBarType.fixed,
          items: _tabs.map((t) => BottomNavigationBarItem(
            icon: Text(t['emoji'], style: const TextStyle(fontSize: 20)),
            label: t['label'],
          )).toList(),
        ) : null,
      ),
    );
  }
}
