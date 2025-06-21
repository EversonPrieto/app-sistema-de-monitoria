import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, useWindowDimensions } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Navbar from '../(componentes)/navbar';

const LARGE_SCREEN_BREAKPOINT = 768;

const Section = ({ title, children, isLargeScreen }: { title: string; children: React.ReactNode, isLargeScreen: boolean }) => (
    <View style={styles.sectionContainer}>
        <Text style={[styles.sectionTitle, isLargeScreen && styles.sectionTitleLarge]}>{title}</Text>
        <View style={styles.separator} />
        {children}
    </View>
);

const RoleCard = ({ icon, role, description, isLargeScreen }: { icon: any; role: string; description: string, isLargeScreen: boolean }) => (
    <View style={[styles.roleCard, isLargeScreen && styles.roleCardLarge]}>
        <View style={styles.roleIconContainer}>
            <FontAwesome name={icon} size={24} color="#508CA4" />
        </View>
        <Text style={styles.roleTitle}>{role}</Text>
        <Text style={styles.roleDescription}>{description}</Text>
    </View>
);

export default function SobreScreen() {
    const { width } = useWindowDimensions();
    const isLargeScreen = width >= LARGE_SCREEN_BREAKPOINT;

    return (
        <SafeAreaView style={styles.safeArea}>
            <Navbar />
            <ScrollView contentContainerStyle={styles.container}>
                <View style={[styles.contentWrapper, isLargeScreen && styles.contentWrapperLarge]}>

                    <View style={styles.header}>
                        <Text style={[styles.headerTitle, isLargeScreen && styles.headerTitleLarge]}>Sobre a Askademia</Text>
                        <Text style={styles.headerSubtitle}>
                            Conectando Mentes e Construindo Conhecimento.
                        </Text>
                    </View>

                    <Section title="Nossa Missão" isLargeScreen={isLargeScreen}>
                        <Text style={styles.paragraph}>
                            A Askademia nasceu da necessidade de um espaço centralizado e confiável onde o aprendizado nunca para. Nossa missão é criar um ecossistema acadêmico digital, onde alunos podem tirar dúvidas, monitores podem aprofundar seu conhecimento ajudando outros, e professores podem guiar e validar o fluxo de informações, garantindo a qualidade e a precisão do conhecimento compartilhado.
                        </Text>
                    </Section>

                    <Section title="Nossa Comunidade" isLargeScreen={isLargeScreen}>
                        <View style={isLargeScreen && styles.roleCardsContainerLarge}>
                            <RoleCard
                                icon="graduation-cap"
                                role="Alunos"
                                description="Um ambiente seguro e colaborativo para você fazer perguntas, encontrar respostas e acelerar seu aprendizado com a ajuda de colegas e especialistas."
                                isLargeScreen={isLargeScreen}
                            />
                            <RoleCard
                                icon="star"
                                role="Monitores"
                                description="Compartilhe seu conhecimento, ganhe reconhecimento e desenvolva suas habilidades de ensino ao guiar outros alunos na jornada do aprendizado."
                                isLargeScreen={isLargeScreen}
                            />
                            <RoleCard
                                icon="shield"
                                role="Professores"
                                description="Supervisione, valide e enriqueça as discussões. Sua expertise garante que a Askademia seja uma fonte de informação confiável e de alta qualidade."
                                isLargeScreen={isLargeScreen}
                            />
                        </View>
                    </Section>

                    <Section title="Por que a Askademia?" isLargeScreen={isLargeScreen}>
                        <Text style={styles.paragraph}>
                            Acreditamos que a colaboração é a chave para o sucesso acadêmico. Nossa plataforma foi desenhada para ser intuitiva, acessível e focada no que realmente importa: a troca de conhecimento de forma clara e eficiente.
                        </Text>
                    </Section>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: 'white',
    },
    container: {
        flexGrow: 1,
        backgroundColor: 'white',
        paddingVertical: 20,
    },
    contentWrapper: {
        paddingHorizontal: 20,
    },
    contentWrapperLarge: {
        width: '100%',
        maxWidth: 960,
        alignSelf: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 30,
        paddingVertical: 20,
        backgroundColor: '#F8FAFC', 
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#508CA4',
        fontFamily: 'Inknut Antiqua',
    },
    headerTitleLarge: {
        fontSize: 40,
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#4A5568',
        marginTop: 8,
        textAlign: 'center',
    },
    sectionContainer: {
        marginBottom: 35,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1E293B',
        marginBottom: 10,
    },
    sectionTitleLarge: {
        fontSize: 28,
    },
    separator: {
        height: 2,
        backgroundColor: '#F49F0A',
        width: 60,
        marginBottom: 15,
    },
    paragraph: {
        fontSize: 16,
        lineHeight: 26,
        color: '#334155',
    },
    roleCardsContainerLarge: {
        flexDirection: 'row',
        gap: 20,
    },
    roleCard: {
        backgroundColor: '#F8FAFC',
        borderRadius: 12,
        padding: 20,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        alignItems: 'center',
    },
    roleCardLarge: {
        flex: 1,
        marginBottom: 0,
    },
    roleIconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#E0F2FE',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    roleTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1E293B',
        marginBottom: 8,
    },
    roleDescription: {
        fontSize: 15,
        color: '#475569',
        textAlign: 'center',
        lineHeight: 22,
    },
});