package com.munggle.jwt;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtProvider jwtProvider;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String token = jwtProvider.resolveToken(request);

        if (StringUtils.hasText(token) && jwtProvider.validateToken(token)) {
            Authentication authentication = jwtProvider.getAuthentication(token);
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }

        if (request.getRequestURI().startsWith("/refresh")) {
            successfulRefreshAuthentication(request, response);
            return;
        }

        filterChain.doFilter(request, response);
    }

    private void successfulRefreshAuthentication(HttpServletRequest request,
                                                 HttpServletResponse response) throws IOException {
        String refreshToken = jwtProvider.resolveToken(request);

        try {
            String newAccessToken = jwtProvider.refreshAccessToken(refreshToken);
            response.setHeader("Access-token", "Bearer " + newAccessToken);
        } catch (RuntimeException e) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write(e.getMessage());
        }
    }
}
